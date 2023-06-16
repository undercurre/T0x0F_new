// eslint-disable-next-line no-unused-vars
import debugUtil from '../util/debugUtil'

export default {
  setUserInfo(state, payload) {
    state.userInfo = payload
  },
  setHomeInfo(state, payload) {
    state.homeInfo = payload
  },
  setDeviceInfo(state, payload) {
    state.deviceInfo = payload
  },
  setDeviceDetail(state, payload) {
    state.deviceDetail = payload
  },
  mergeDeviceDetail(state, payload) {
    state.deviceDetail = { ...state.deviceDetail, ...payload }
  },
  setTrackInfo(state, payload) {
    Object.assign(state.trackInfo, payload)
  },
  setDeviceModel(state, payload) {
    state.otherInfo.deviceModel = payload
  },
  setThrottleTempData(state, payload) {
    state.throttleTempData = payload
  },
  setIsUpdateDeviceModel(state) {
    state.otherInfo.isUpdateDeviceModel = true
  },
  saveThrottleTempData(state) {
    state.throttleTempData = { ...state.deviceDetail }
  },
  setMemberList(state, payload) {
    state.memberList = payload
  },
  setRecordList(state, payload) {
    state.recordList = payload
  },
  setCurMember(state, payload) {
    debugUtil.log('存入缓存', payload)
    state.curMember = payload
    const curAdmin = state.memberList.find(item => {
      return item.isDefault === '1' && item.userId === state.userInfo.uid
    })
    this._vm.$storage.setStorage(`${curAdmin.userId}_selected`, payload)
  },
}
