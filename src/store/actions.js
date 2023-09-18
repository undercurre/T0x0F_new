import merge from 'lodash/merge'
import dayjs from 'dayjs'
import debugUtil from '../util/debugUtil'
import { SimpleDiff } from '../util'
import { commomParam, event } from '../common/burialPointData'
import { DEBOUNCE_TIME, THROTTLE_TIME } from '../config'
import { getNowTime } from '../util'

let debounceTimer = null
let throttleTimer = null

export default {
  // 用于页面首次加载
  async init({ dispatch, state }) {
    await dispatch('updateDeviceInfo')
    if (state.deviceInfo.isOnline === '0') {
      return
    }

    await Promise.all([dispatch('updateUserInfo'), dispatch('updateHomeInfo')])
  },
  async getBaseInfo({ state, dispatch, commit, getters }) {
    await dispatch('updateDeviceInfo')
    debugUtil.log('getBaseInfo-获取设备信息', state.deviceInfo)
    await dispatch('init')
    debugUtil.log('getBaseInfo-获取到成员信息', state.userInfo)
    const initRes = await dispatch('initScaleUser')
    debugUtil.log('getBaseInfo-初始化成员', initRes)
    const query = await dispatch('queryScaleUserList')
    debugUtil.log('getBaseInfo-查询成员', query)
    debugUtil.log('getBaseInfo-当前主人', getters.curAdmin)
    try {
      const res = await this._vm.$storage.getStorage(
        `${getters.curAdmin.userId}_selected`
      )
      debugUtil.log('getBaseInfo-获取缓存成功', res)
      if (res) {
        commit('setCurMember', res)
      } else {
        commit('setCurMember', getters.curAdmin.scaleUserId)
      }
    } catch (err) {
      debugUtil.log('getBaseInfo-获取缓存失败', err)
      commit('setCurMember', getters.curAdmin.scaleUserId)
    }
  },
  async updateHomeInfo({ commit }) {
    const response = await this._vm.$bridge
      .getCurrentHomeInfo()
      .catch(() => this._vm.$bridge.showToast('获取家庭信息失败', 1.5))
    debugUtil.log('updateHomeInfo', response)
    commit('setHomeInfo', response)
    return response
  },
  async updateUserInfo({ commit }) {
    const response = await this._vm.$bridge
      .getUserInfo()
      .catch(() => this._vm.$bridge.showToast('获取用户信息失败', 1.5))

    debugUtil.log('updateUserInfo', response)

    commit('setUserInfo', response)
    return response
  },
  async updateDeviceInfo({ commit }) {
    const response = await this._vm.$bridge.getDeviceInfo().catch(err => {
      this._vm.$log({ 'updateDeviceInfo-err:': err })
      this._vm.$bridge.showToast('设备信息获取失败')
    })

    this._vm.$log({ updateDeviceInfo: response })
    commit('setDeviceInfo', response.result)
    return response
  },
  /**
   * 查询后拿到数据延时更新
   * @param commit
   * @param delay number 防抖延时时间：ms
   * @param isShowLoading boolean 是否显示loading
   */
  updateDeviceDetail(
    { commit },
    { isShowLoading = false, delay = DEBOUNCE_TIME } = {}
  ) {
    return new Promise((resolve, reject) => {
      // 防抖处理
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      debounceTimer = setTimeout(async () => {
        const res = await this._vm.$bridge
          .sendLuaRequest(
            {
              operation: 'luaQuery',
              params: {},
            },
            isShowLoading
          )
          .catch(err => {
            debugUtil.log('updateDeviceDetail-err:', err)
            reject(err)
            this._vm.$bridge.showToast('设备状态获取失败')
          })
        debugUtil.log('updateDeviceDetail-res', res)
        // 安卓苹果返回的errorCode类型不一致
        if (parseInt(res.errorCode) !== 0) {
          this._vm.$bridge.showToast('设备状态获取失败')
          reject(res)
          return
        }
        resolve(res.result)
        commit('setDeviceDetail', res.result)
      }, delay)
    })
  },
  /**
   * 网关设备更新设备详情数据
   * @returns {Promise<*>}
   */
  async updateGatewayDeviceDetail({ state, dispatch, commit }) {
    const response = await dispatch(
      'getGatewayDeviceInfo',
      state.deviceInfo.deviceId
    )

    debugUtil.log('updateGatewayDeviceDetail', response)

    if (response.code === 0) {
      commit('setDeviceDetail', response.data.data)
    } else {
      this._vm.$bridge.showToast('获取网关设备信息失败', 1.5)
    }
    return response
  },
  /**
   * 发送控制指令
   * @param params 参数
   * @param isUpdateDetail boolean 发送控制后是否更新detail
   * @param isThrottle boolean 是否使用节流
   * @param controlDelay number 节流的时间参数
   * @param burialPointParams 埋点信息
   * @param burialPointParams.object string 埋点信息
   * @param burialPointParams.value string 埋点信息
   * @param burialPointParams.ex_value string 埋点信息
   */
  async luaControl(
    { dispatch, state, commit },
    {
      params = {},
      isUpdateDetail = false,
      isThrottle = true,
      controlDelay = THROTTLE_TIME,
      burialPointParams,
    }
  ) {
    // 通用下发指令操作
    const controlFunc = async params => {
      debugUtil.log('luaControl params:', JSON.stringify(params))
      // 埋点
      if (burialPointParams) {
        dispatch('setFuncClickCheckBurialPoint', burialPointParams)
      }
      const res = await this._vm.$bridge
        .sendLuaRequest(
          {
            operation: 'luaControl',
            params,
          },
          false
        )
        .catch(() => {
          this._vm.$bridge.showToast('设备控制信息发送失败')
        })
      debugUtil.log('luaControl的response.errorCode:', res.errorCode)
      // 埋点
      if (burialPointParams) {
        dispatch('setFuncClickResultBurialPoint', {
          ...burialPointParams,
          result: parseInt(res.errorCode) === 0 ? '成功' : '失败',
          fail_reason: parseInt(res.errorCode) === 0 ? '' : res.errorCode,
        })
      }
      if (isUpdateDetail) {
        dispatch('updateDeviceDetail')
      }
    }

    // 不使用节流
    if (!isThrottle) {
      await controlFunc(params)
      return
    }
    if (!throttleTimer) {
      // 如果定时器为null，先保存一次数据，然后下发
      commit('saveThrottleTempData')
      controlFunc(params)
      // 一段时间之后再diff，如果有变化就再次下发
      throttleTimer = setTimeout(async () => {
        const controlData = SimpleDiff(
          state.deviceDetail,
          state.throttleTempData
        )
        if (!controlData) {
          // 如果diff后没有数据改变则不做下发
          throttleTimer = null // 清除定时器id
          return
        }
        // 数据有变化，先保存一次数据，然后下发
        commit('saveThrottleTempData')
        await controlFunc(controlData)
        throttleTimer = null // 定时器逻辑执行完成，清除定时器id
      }, controlDelay)
    }
  },
  async sendCentralCloudRequest(
    _,
    { url, params = {}, option = { isShowLoading: true } }
  ) {
    const reqId = this._vm.$bridge.genMessageId()
    const stamp = dayjs().format('YYYYMMDDhhmmss')
    const sendData = merge(
      {
        method: 'POST',
        data: {
          reqId,
          stamp,
          tm: stamp,
          requestId: reqId, // 有的用的这个字段
        },
      },
      params
    )

    const res = await this._vm.$bridge
      .sendCentralCloudRequest(url, sendData, option)
      .catch(error => {
        debugUtil.log('sendCentralCloudRequest-err', error)
        return error
      })

    debugUtil.log('sendCentralCloudRequest', url, sendData, params)
    debugUtil.log('sendCentralCloudRequest-res', res)

    return res
  },
  /**
   * 物模型指令接口封装
   * @param url 传入【/v1/appliance/operation/】后面部分的url
   * @param params 默认Post方法
   */
  async sendModelCommand({ dispatch }, { url, params = {} }) {
    const msgId = this._vm.$bridge.genMessageId()

    const sendData = merge(
      {
        data: {
          msgId,
        },
      },
      params
    )

    const reqUrl = `/v1/appliance/operation/${url}`

    const res = await dispatch('sendCentralCloudRequest', {
      url: reqUrl,
      params: sendData,
      option: {
        isShowLoading: false,
      },
    })

    debugUtil.log('sendModelCommand-req:', reqUrl, sendData)

    debugUtil.log('sendModelCommand-res：', reqUrl, res)
    return {
      isSuccess: res.code === '0',
      ...res,
    }
  },
  /**
   * 品类服接口调用
   * @param state
   * @param params 接口业务参数
   * @param isShowLoading 是否展示loading
   * @param isDebug
   */
  async requestDataTransmit(
    { state },
    {
      params = { queryStrings: {}, transmitData: {} },
      isShowLoading = false,
      isDebug = true,
    }
  ) {
    if (isShowLoading) {
      this._vm.$bridge.showLoading()
    }

    const msgId = this._vm.$bridge.genMessageId()

    // 统一增加userId等公共参数
    params.type = params.type || state.deviceInfo.deviceType
    params.transmitData.userId = state.userInfo.uid
    params.transmitData.msgId = msgId
    params.transmitData.houseId = state.userInfo.homeId

    const response = await this._vm.$bridge
      .requestDataTransmit(params)
      .catch(err => err)

    if (response && response.returnData) {
      response.returnData = JSON.parse(response.returnData)
    }

    if (isDebug) {
      debugUtil.log('requestDataTransmit-params', params)
      debugUtil.log('requestDataTransmit-response', response)
    }

    if (isShowLoading) {
      this._vm.$bridge.hideLoading()
    }

    if (response === 'system error') {
      this._vm.$bridge.showToast('服务器异常')
    }

    // 以前有些接口还在用code，需要适配
    return {
      ...response,
      isSuccess:
        response.status === 0 &&
        response.returnData &&
        ((response.returnData.errorCode &&
          response.returnData.errorCode === '0') ||
          (response.returnData.code && response.returnData.code === '0')), // 接口规范，所有品类服接口的errorCode为字符串类型
    }
  },
  /**
   * 获取网关子设备基础信息
   */
  async getGatewayDeviceInfo({ getters, dispatch }, deviceId) {
    return dispatch('sendCentralCloudRequest', {
      url: '/v1/gateway/device/getInfo',
      params: {
        data: {
          homegroupId: getters.homeId,
          applianceCode: deviceId,
        },
      },
      option: {
        isShowLoading: false,
      },
    })
  },
  /**
   * 获取产品型号信息
   */
  async updateDeviceModel({ state, commit, dispatch }) {
    const res = await dispatch('sendCentralCloudRequest', {
      url: '/dcp-web/api-product/message/getProductBySerialNoNew',
      params: {
        serialNo: state.deviceInfo.deviceSn,
        sourceSys: 'APP',
        tm: Math.round(new Date().getTime() / 1000),
      },
    }).catch(error => {
      commit('setIsUpdateDeviceModel')
      debugUtil.log('updateDeviceModel-err', error)
      this._vm.$bridge.showToast('获取设备型号失败')
      return error
    })
    debugUtil.log('updateDeviceModel-res', res)
    commit('setIsUpdateDeviceModel')
    if (res.data && res.data.productModels && res.data.productModels[0]) {
      const deviceModel = res.data.productModels[0]
      debugUtil.log('deviceModel', deviceModel)
      commit('setDeviceModel', deviceModel)
    }
    return res
  },
  /**
   * 埋点
   * @param event   事件名
   * @param eventParams  自定义属性
   */
  async setBurialPoint({ state, dispatch }, { event, eventParams }) {
    debugUtil.log('state.otherInfo', state.otherInfo)
    // 获取型号信息
    if (!state.otherInfo.deviceModel && !state.otherInfo.isUpdateDeviceModel) {
      await dispatch('updateDeviceModel')
    }

    const params = {
      event,
      eventParams: {
        ...commomParam,
        widget_name: `${state.deviceInfo.deviceType}_${state.deviceInfo.deviceSn8}`, // 插件包名称
        widget_version: PLUGIN_VERSION, // 插件包版本号
        widget_cate: state.deviceInfo.deviceType, // 设备品类代码
        widget_type: state.otherInfo.deviceModel,
        sn8: state.deviceInfo.deviceSn8, // SN8
        iot_device_id: state.deviceInfo.deviceId, // 15位设备ID
        page_name: state.trackInfo.curPageName,
      },
    }

    // 自定义参数obj增量替换通用参数eventParams
    Object.assign(params.eventParams, eventParams)
    debugUtil.log('setBurialPoint-params', params)
    this._vm.$bridge.trackEvent(params)
  },
  /**
   * plugin_function_click_check埋点
   * @param dispatch
   * @param burialPointParams 埋点信息
   * @param burialPointParams.object string 埋点信息
   * @param burialPointParams.value string 埋点信息
   * @param burialPointParams.ex_value string 埋点信息
   */
  setFuncClickCheckBurialPoint({ dispatch }, burialPointParams) {
    dispatch('setBurialPoint', {
      event: event.plugin_function_click_check,
      eventParams: {
        object: burialPointParams.object,
        ex_value: burialPointParams.ex_value,
        value: burialPointParams.value,
        is_legal: '是',
      },
    })
  },
  /**
   * plugin_function_click_result埋点
   * @param dispatch
   * @param burialPointParams 埋点信息
   * @param burialPointParams.object string 埋点信息
   * @param burialPointParams.value string 埋点信息
   * @param burialPointParams.ex_value string 埋点信息
   * @param burialPointParams.result string 控制结果
   * @param burialPointParams.fail_reason string 失败原因
   */
  setFuncClickResultBurialPoint({ dispatch }, burialPointParams) {
    dispatch('setBurialPoint', {
      event: event.plugin_function_click_result,
      eventParams: {
        object: burialPointParams.object,
        ex_value: burialPointParams.ex_value,
        value: burialPointParams.value,
        result: burialPointParams.result,
        fail_reason: burialPointParams.fail_reason,
      },
    })
  },

  // 初始化成员
  async initScaleUser({ state, dispatch }) {
    const userListInMeiju = await this._vm.$bridge.getHomeMemberList({
      homeId: state.homeInfo.homeId,
    })

    debugUtil.log('该家庭的成员列表', userListInMeiju)

    const param = {
      type: '0x0F',
      queryStrings: {
        // 对应云端请求头param字段
        proType: '0x0F',
        handleType: 'initScaleUser',
      },
      transmitData: {
        // 对应云端请求头data字段 --ps:云端的data字段是string 类型，js里的requestDataTransmit是json对象，由APP端转字符串并且加密后传给云端
        //（注意key值不能是data字段）
        houseId: state.homeInfo.homeId,
        scaleUsers: userListInMeiju.list.map(item => {
          return {
            userId: item.uid,
            username: item.nickname,
          }
        }),
      },
    }

    const res = await dispatch('requestDataTransmit', {
      params: param,
    })

    if (res.isSuccess) {
      return res
    } else {
      this._vm.$bridge.showToast('初始化成员列表失败', 1.5)
    }
  },

  // 查询体脂秤成员列表
  async queryScaleUserList({ state, dispatch, commit }) {
    debugUtil.log('queryScaleUserList', state.homeInfo.homeId)
    debugUtil.log(
      'queryScaleUserList',
      state.homeInfo.roleId === '1001' || state.homeInfo.roleId === '1002'
        ? '1'
        : '0'
    )
    debugUtil.log('queryScaleUserList', state.userInfo.uid)
    const param = {
      type: '0x0F',
      queryStrings: {
        // 对应云端请求头param字段
        proType: '0x0F',
        handleType: 'queryScaleUserList',
      },
      transmitData: {
        // 对应云端请求头data字段 --ps:云端的data字段是string 类型，js里的requestDataTransmit是json对象，由APP端转字符串并且加密后传给云端
        //（注意key值不能是data字段）
        houseId: state.homeInfo.homeId,
        isAdmin:
          state.homeInfo.roleId === '1001' || state.homeInfo.roleId === '1002'
            ? '1'
            : '0',
        userId: state.userInfo.uid,
      },
    }
    debugUtil.log(param)
    const res = await dispatch('requestDataTransmit', {
      params: param,
    })

    if (res.isSuccess) {
      commit('setMemberList', res.returnData.result.scaleUserList)
      const emojiRegex =
        /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\u200D/g
      res.returnData.result.scaleUserList.forEach(item => {
        item.username = item.username.replace(emojiRegex, '[表情]')
      })
      return res.returnData.result.scaleUserList
    } else {
      this._vm.$bridge.showToast('获取成员列表失败', 1.5)
    }
  },

  // 增加成员
  async addScaleUser({ state, dispatch }, userInfo) {
    const param = {
      type: '0x0F',
      queryStrings: {
        // 对应云端请求头param字段
        proType: '0x0F',
        handleType: 'addScaleUser',
      },
      transmitData: {
        // 对应云端请求头data字段 --ps:云端的data字段是string 类型，js里的requestDataTransmit是json对象，由APP端转字符串并且加密后传给云端
        //（注意key值不能是data字段）
        houseId: state.homeInfo.homeId,
        userId: state.userInfo.uid,
        username: userInfo.username,
        sex: userInfo.sex,
        height: userInfo.height,
        birthday: userInfo.birthday,
        headImageUrl: userInfo.headImageUrl,
      },
    }

    const res = await dispatch('requestDataTransmit', {
      params: param,
    })

    if (res.isSuccess) {
      return res
    } else {
      this._vm.$bridge.showToast('增加成员失败', 1.5)
    }
  },

  // 修改体脂秤成员
  // eslint-disable-next-line no-unused-vars
  async uptScaleUser({ getters, dispatch }, userInfo) {
    debugUtil.log('修改成员信息', getters.curMemberDetail, userInfo)
    const param = {
      type: '0x0F',
      queryStrings: {
        // 对应云端请求头param字段
        proType: '0x0F',
        handleType: 'uptScaleUser',
      },
      transmitData: {
        // 对应云端请求头data字段 --ps:云端的data字段是string 类型，js里的requestDataTransmit是json对象，由APP端转字符串并且加密后传给云端
        //（注意key值不能是data字段）
        scaleUserId: userInfo.scaleUserId,
        username: userInfo.username,
        sex: userInfo.sex,
        height: userInfo.height,
        birthday: userInfo.birthday,
        headImageUrl: userInfo.headImageUrl || '',
        targetWeight: userInfo.targetWeight || null,
      },
    }

    const res = await dispatch('requestDataTransmit', {
      params: param,
    })

    if (res.isSuccess) {
      return res
    } else {
      this._vm.$bridge.showToast('修改成员信息失败', 1.5)
    }
  },

  // 批量删除体脂秤成员
  async batchDelScaleUser({ getters, commit, dispatch }, userIds) {
    const param = {
      type: '0x0F',
      queryStrings: {
        // 对应云端请求头param字段
        proType: '0x0F',
        handleType: 'batchDelScaleUser',
      },
      transmitData: {
        // 对应云端请求头data字段 --ps:云端的data字段是string 类型，js里的requestDataTransmit是json对象，由APP端转字符串并且加密后传给云端
        //（注意key值不能是data字段）
        scaleUserIds: userIds,
      },
    }

    const res = await dispatch('requestDataTransmit', {
      params: param,
    })

    if (res.isSuccess) {
      await dispatch('queryScaleUserList')
      commit('setCurMember', getters.curAdmin.scaleUserId)
      debugUtil.log('保存后查询')
      setTimeout(() => {
        const nowTime = {
          pageTime: getNowTime(),
        }
        debugUtil.log('查询时间', nowTime)
        dispatch('queryScaleWeightHistoryList', nowTime)
      }, 2000)
      return res
    } else {
      this._vm.$bridge.showToast('删除成员失败', 1.5)
    }
  },

  // 增加体重记录
  async saveScaleWeightHistory({ state, dispatch, getters }, data) {
    const param = {
      type: '0x0F',
      queryStrings: {
        // 对应云端请求头param字段
        proType: '0x0F',
        handleType: 'saveScaleWeightHistory',
      },
      transmitData: {
        // 对应云端请求头data字段 --ps:云端的data字段是string 类型，js里的requestDataTransmit是json对象，由APP端转字符串并且加密后传给云端
        //（注意key值不能是data字段）
        scaleUserId: getters.curMemberDetail.scaleUserId,
        deviceId: state.deviceInfo.mac.toUpperCase(),
        modelNum: state.deviceInfo.deviceSn8,
        weight: data.weight,
        impedance: data.impedance,
      },
    }

    const res = await dispatch('requestDataTransmit', {
      params: param,
    })

    if (res.isSuccess) {
      debugUtil.log('保存后查询')
      setTimeout(() => {
        const nowTime = {
          pageTime: getNowTime(),
        }
        debugUtil.log('查询时间', nowTime)
        dispatch('queryScaleWeightHistoryList', nowTime)
      }, 2000)
      return res
    } else {
      this._vm.$bridge.showToast('保存记录失败', 1.5)
    }
  },

  // 查询体脂秤体重记录
  async queryScaleWeightHistoryList(
    { state, getters, commit, dispatch },
    time
  ) {
    const param = {
      type: '0x0F',
      queryStrings: {
        // 对应云端请求头param字段
        proType: '0x0F',
        handleType: 'queryScaleWeightHistoryList',
      },
      transmitData: {
        // 对应云端请求头data字段 --ps:云端的data字段是string 类型，js里的requestDataTransmit是json对象，由APP端转字符串并且加密后传给云端
        //（注意key值不能是data字段）
        scaleUserId: getters.curMemberDetail.scaleUserId,
        deviceId: state.deviceInfo.mac.toUpperCase(),
        pageTime: time.pageTime,
        startTime: time.startTime,
        endTime: time.endTime,
      },
    }
    debugUtil.log('查询参数', param)
    const res = await dispatch('requestDataTransmit', {
      params: param,
    })
    debugUtil.log('查询体重记录', res)

    if (res.isSuccess) {
      commit('setRecordList', res.returnData.result.scaleWeightHistoryList)
      return res
    } else {
      this._vm.$bridge.showToast('查询历史记录失败', 1.5)
    }
  },

  // 查询体脂秤体重记录统计
  async queryScaleWeightByTimes({ state, getters, dispatch }, dateType) {
    const param = {
      type: '0x0F',
      queryStrings: {
        // 对应云端请求头param字段
        proType: '0x0F',
        handleType: 'queryScaleWeightByTimes',
      },
      transmitData: {
        // 对应云端请求头data字段 --ps:云端的data字段是string 类型，js里的requestDataTransmit是json对象，由APP端转字符串并且加密后传给云端
        //（注意key值不能是data字段）
        deviceId: state.deviceInfo.mac.toUpperCase(),
        scaleUserId: getters.curMemberDetail.scaleUserId,
        dateType,
      },
    }

    const res = await dispatch('requestDataTransmit', {
      params: param,
    })

    return res
  },
  /**
   * 上传头像（图片）到oss服务器
   */
  // eslint-disable-next-line no-unused-vars
  uploadPicToOss({ state }, fileUrl) {
    debugUtil.log('fileUrl', fileUrl)
    const params = {
      fileList: [fileUrl],
    }
    debugUtil.log('fileParams', params)
    return new Promise((resolve, reject) => {
      this._vm.$bridge.uploadFileToOss(
        params,
        res => {
          debugUtil.log('uploadFileToOss', res)
          if (res.progress == 100) {
            resolve({
              isSuccess: true,
              files: res.fileList.map(item => ({
                path: item.fileUrl,
              })),
            })
          }
        },
        err => {
          debugUtil.log('uploadFileToOss-err', err)
          reject({
            isSuccess: false,
            errData: err,
          })
        }
      )
    })
  },
  // 查询设备版本信息
  async queryDeviceVersionInfo({ state }) {
    const res = await this._vm.$bridge.sendLuaRequest(
      {
        operation: 'luaControl',
        params: {
          query_device_version_info: 'queryDeviceVersionInfo',
        },
        applianceId: state.deviceInfo.deviceId,
        mode: 0,
      },
      false
    )
    this._vm.$bridge.showToast(
      JSON.stringify({
        query_device_version_info: 'queryDeviceVersionInfo',
      })
    )
    return res
  },
  // 用户信息查询
  async queryUserInfoMark({ state }) {
    const res = await this._vm.$bridge.sendLuaRequest(
      {
        operation: 'luaControl',
        params: {
          query_userinfo_mark: 'queryUserinfo',
        },
        applianceId: state.deviceInfo.deviceId,
        mode: 0,
      },
      false
    )
    this._vm.$bridge.showToast(
      JSON.stringify({
        query_userinfo_mark: 'queryUserinfo',
      })
    )
    return res
  },
  // 恢复出厂数据
  async resetFactory({ state }) {
    const res = await this._vm.$bridge.sendLuaRequest(
      {
        operation: 'luaControl',
        params: {
          reset_factory: 'resetFactory',
        },
        applianceId: state.deviceInfo.deviceId,
        mode: 0,
      },
      false
    )
    this._vm.$bridge.showToast(
      JSON.stringify({
        reset_factory: 'resetFactory',
      })
    )
    return res
  },
  // 电量查询
  async batteryLevelMark({ state }) {
    const res = await this._vm.$bridge.sendLuaRequest(
      {
        operation: 'luaControl',
        params: {
          battery_level_mark: 'queryBatteryLevel',
        },
        applianceId: state.deviceInfo.deviceId,
        mode: 0,
      },
      false
    )
    this._vm.$bridge.showToast(
      JSON.stringify({
        battery_level_mark: 'queryBatteryLevel',
      })
    )
    return res
  },
  // 查询设备SN
  async queryDeviceSnMark({ state }) {
    const res = await this._vm.$bridge.sendLuaRequest(
      {
        operation: 'luaControl',
        params: {
          query_device_sn_mark: 'queryDeviceSn',
        },
        applianceId: state.deviceInfo.deviceId,
        mode: 0,
      },
      false
    )
    this._vm.$bridge.showToast(
      JSON.stringify({
        query_device_sn_mark: 'queryDeviceSn',
      })
    )
    return res
  },
  // 同步历史数据
  async querySynchronization({ state }) {
    const res = await this._vm.$bridge.sendLuaRequest(
      {
        operation: 'luaControl',
        params: {
          synchronization_mark: 'querySynchronization',
          synchronization_user_pin: '1003',
        },
        applianceId: state.deviceInfo.deviceId,
        mode: 0,
      },
      false
    )
    this._vm.$bridge.showToast(
      JSON.stringify({
        synchronization_mark: 'querySynchronization',
        synchronization_user_pin: '1003',
      })
    )
    return res
  },
  // 设置新增加用户PIN
  async addUserPIN({ state }) {
    const res = await this._vm.$bridge.sendLuaRequest(
      {
        operation: 'luaControl',
        params: {
          add_user_pin_mark: 'addUserPin',
          add_user_pin: '1',
          add_user_age: '25',
          add_user_sex: 'male',
          add_user_height: '150',
          add_user_weight: '60.56',
          add_user_timestamp: '666666',
        },
        applianceId: state.deviceInfo.deviceId,
        mode: 0,
      },
      false
    )
    this._vm.$bridge.showToast(
      JSON.stringify({
        add_user_pin_mark: 'addUserPin',
        add_user_pin: '1',
        add_user_age: '25',
        add_user_sex: 'male',
        add_user_height: '150',
        add_user_weight: '60.56',
        add_user_timestamp: '666666',
      })
    )
    return res
  },
}
