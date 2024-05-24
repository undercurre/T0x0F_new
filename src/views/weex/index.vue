<template>
  <div
    style="background-color: #f9f9f9"
    :is-immersion="true"
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
  >
    <div
      :style="{
        height: unAble2Scroll ? '9999px' : this.pageHeight + 'px',
      }"
      @touchstart="touchOut"
      @touchmove="touchOut"
    >
      <scroller
        class="scroller"
        :style="{
          height: unAble2Scroll ? '9999px' : this.pageHeight + 'px',
        }"
        @scroll="getScrollY"
      >
        <refresh
          style="width: 750px; height: 0px"
          v-if="showBigArea"
          @refresh="onrefresh"
          @pullingdown="onpullingdown"
          :display="refreshing ? 'show' : 'hide'"
        >
        </refresh>
        <div
          class="content"
          :style="{
            minHeight: this.pageHeight,
          }"
        >
          <image
            ref="infoArea"
            class="gredient"
            :src="gredient"
            style="width: 750px; height: 750px"
          ></image>
          <WeightArea
            v-if="!showBigArea"
            class="weight"
            :connect="isConnect"
            :weight="showWeightNum"
            :unit="weightMeasurement.measurement.weightUnit || 'kg'"
            :time="showUpdateTime"
            :target="showTarget"
          ></WeightArea>
          <!-- <text>{{ tempX }},{{ tempY }}</text> -->

          <div class="status_content" v-if="!showBigArea">
            <StatusBar class="status" :status="isConnect"></StatusBar>
            <PersonList
              class="person"
              :offSelector="offSelector"
              @offBack="offBack"
            >
            </PersonList>
          </div>
          <div class="report" ref="infoCard">
            <text class="tip" v-if="showBigArea">下拉离开个人报告</text>
            <WeightInfoCard
              :weight="showWeightNum"
              :unit="weightMeasurement.measurement.weightUnit || 'kg'"
              v-if="showBigArea"
            ></WeightInfoCard>
            <ReportBodyType
              v-if="showBigArea"
              class="body_type"
            ></ReportBodyType>
          </div>
          <div
            class="zhibiao"
            :style="{ marginTop: showBigArea ? '32px' : '754px' }"
          >
            <PersonReport></PersonReport>
          </div>

          <div :style="{ height: bottomArc }"></div>
          <div class="fill" v-if="isIos" style="height: 252px"></div>
          <div class="fill" v-if="!isIos" style="height: 182px"></div>
        </div>
      </scroller>
      <dof-minibar
        class="minibar"
        :backgroundColor="scrollY < -100 ? '#fff' : 'transparent'"
        @dofMinibarLeftButtonClicked="minibarLeftButtonClick"
      >
        <div slot="left">
          <image
            :src="leftButton"
            style="height: 55px; width: 55px; transform: translateX(-10px)"
          ></image>
        </div>
        <div slot="middle">
          <text class="title_text">{{ this.deviceInfo.deviceName }}</text>
        </div>
        <div slot="right">
          <image
            :src="moreButton"
            style="height: 55px; width: 55px"
            @click="minibarRightButtonClick"
          ></image>
        </div>
      </dof-minibar>
    </div>
    <dof-bottom-bar
      style="border-top-right-radius: 64px; border-top-left-radius: 64px"
      :tab-groups="scene2"
      :tab-bar-position="{ position: 'absolute', bottom: '0px' }"
      @dofTabItemClicked="tabBarOperateHandler"
    ></dof-bottom-bar>
  </div>
</template>
<script>
import { DofMinibar, DofBottomBar } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import moreButton from '../../assets/image/header/more_black.png'
import StatusBar from '../../components/StatusBar.vue'
import WeightArea from '../../components/WeightArea.vue'
import gredient from '../../assets/image/gredient.png'
import health from '../../assets/image/health.png'
import holdbaby from '../../assets/image/holdbaby.png'
import PersonList from '../../components/PersonList.vue'
import PersonReport from '../../components/PersonReport.vue'
import debugUtil from '../../util/debugUtil'
import WeightInfoCard from '../../components/WeightInfoCard.vue'
import ReportBodyType from '../../components/ReportBodyType.vue'
import colorBg from '../../assets/image/colorBg.png'
import { decode } from '../../util/decode'
import { parseBluetoothData } from '../../util/parse'
import { mapState, mapActions, mapGetters } from 'vuex'
import {
  throttle,
  getNowDate,
  getNowTime,
  convertResistance,
} from '../../util/index'

const singleBlueToothModule = weex.requireModule('singleBlueToothModule')
const globalEvent = weex.requireModule('globalEvent')
const domModule = weex.requireModule('dom')

export default {
  components: {
    WeightInfoCard,
    ReportBodyType,
    DofMinibar,
    DofBottomBar,
    StatusBar,
    WeightArea,
    PersonList,
    PersonReport,
  },
  mixins: [pageBase],
  data: () => ({
    refreshing: false,
    offSelector: false,
    unAble2Scroll: false,
    isConnect: false,
    isConnectTimer: null,
    wantOpenBlue: true,
    weightMeasurement: {
      mode: {},
      measurement: {},
      time: '',
    },
    impedanceMeasurement: {
      mode: {},
      measurement: {},
      time: '',
    },
    uploadData: {
      weight: 0,
      impedance: 0,
    },
    //TODO: 解释型号是什么型号的什么设备在配网
    scrollY: 0,
    colorBg,
    leftButton,
    moreButton,
    gredient,
    isView: false,
    scene2: [
      {
        type: 'mode',
        title: 'health',
        text: '健康评估',
        iconColor: '#f2f2f2',
        disabled: false,
        icon: health,
      },
      {
        type: 'mode',
        title: 'holdbaby',
        text: '抱婴称重',
        iconColor: '#f2f2f2',
        disabled: false,
        icon: holdbaby,
      },
    ],
    showBigArea: false,
  }),
  async created() {
    await this.getBaseInfo()
    // 没有填信息，或者信息缺失
    // todo: 可以针对单一信息进行跳转
    if (
      this.curAdmin &&
      (this.curAdmin.sex === undefined ||
        this.curAdmin.height === undefined ||
        this.curAdmin.birthday === undefined)
    ) {
      this.$bridge.push({
        url: 'userInfo.js',
      })
    }
  },
  mounted() {
    this.$bridge.showToast('请赤脚站在体重秤上', 1500)
    // 节流提示
    const badImpedanceTip = throttle(() => {
      this.$toast('请赤脚站立在秤上', 3)
    }, 12000)
    const uploadOnce = throttle(async () => {
      if (!this.isView) return
      if (this.uploadData.weight === 0) return
      debugUtil.log('超常规对比', this.newestRecord)
      if (
        Math.abs(this.uploadData.weight - this.newestRecord.weight) > 5 &&
        this.newestRecord &&
        this.newestRecord.weight > 0
      ) {
        debugUtil.log('超出常规')
        const params = {
          title: '与上次测量数据差异较大',
          content: '是否要记录本次数据？',
          args: [
            {
              confirmText: '否',
              index: 10,
            },
            {
              confirmText: '是',
              index: 11,
            },
          ],
        }
        const tempData = this.uploadData
        const res = await this.$bridge.showConfirmView(params)
        debugUtil.log('超常结果', res)
        if (res.index === 10) {
          return
        } else {
          this.uploadData = tempData
        }
      }
      this.saveScaleWeightHistory(this.uploadData).then(res => {
        console.log('保存记录')
        if (res.isSuccess) {
          this.$toast('记录保存成功')
          debugUtil.log('保存后的成员信息检索', this.curMemberDetail)
          if (this.curMemberDetail && !this.curMemberDetail.height) {
            setTimeout(() => {
              this.$toast('计算各项指标数据需要填写成员信息', 3000)
            }, 2000)
          }
          this.getNewData()
          this.uploadData.weight = 0
          this.uploadData.impedance = 0
        }
      })
    }, 12000)
    // 蓝牙监听后的相关逻辑
    globalEvent.addEventListener('receiveMessageFromApp', res => {
      debugUtil.log('连接态', this.isConnect)
      debugUtil.log('receiveMessageFromApp', res.messageType, res.messageBody)
      if (
        res.messageType === 'blueAdvertising' &&
        this.deviceInfo.mac === res.messageBody.mac
      ) {
        // 检测到蓝牙信号
        if (res.messageBody.id === this.deviceInfo.productId) {
          // (用于连接状态蛋)
          if (!this.isConnect) {
            // this.$bridge.showToast('请赤脚站在体重秤上', 5000)
          }
          this.isConnect = true
          clearTimeout(this.isConnectTimer)
          this.isConnectTimer = setTimeout(() => {
            this.isConnect = false
            debugUtil.log('断开连接')
            this.weightMeasurement.weight = 0
            this.getNewData()
          }, 8000)
          // 获取解密后的数据
          const decodeData = decode(res.messageBody.data)
          // 语义化
          const parseData = parseBluetoothData(decodeData)
          if (parseData.mode.code === '01') {
            // 体重数据
            this.weightMeasurement = parseData
            this.weightMeasurement.time = getNowDate()
            debugUtil.log('体重数据', this.weightMeasurement)
            // 采集稳定数据进行上传
            if (parseData.measurement.isStable) {
              debugUtil.log('采集到稳定的体重数据', parseData)
              this.uploadData.weight = parseData.measurement.weight
            }
            if (parseData.measurement.isOverloaded) {
              debugUtil.log('采集到超重的体重数据', parseData)
              this.$bridge.showToast('超载！超载！', 5000)
            }
          } else {
            // 阻抗数据
            // TODO: 假的体脂数据
            this.impedanceMeasurement = parseData
            // this.impedanceMeasurement = {
            //   manufacturerId: 5928,
            //   protocolVersion: 0,
            //   modelNumber: 515,
            //   macAddress: 'ed:68:00:88:29:9d',
            //   random: 57,
            //   mode: {
            //     name: '阻抗',
            //     code: '03',
            //     measurementMode: true,
            //     measurementStatus: true,
            //     impedanceStatus: 0,
            //   },
            //   measurement: {
            //     impedance: '524Ω',
            //     measurementMode: true,
            //     measurementStatus: true,
            //     impedanceStatus: '正常',
            //   },
            //   broadcastNumber: 58,
            //   checksum: 135,
            // }
            debugUtil.log('阻抗数据', this.impedanceMeasurement)
            // 采集正常的阻抗数据
            if (
              this.impedanceMeasurement.measurement.measurementStatus &&
              this.impedanceMeasurement.mode.impedanceStatus === 0
            ) {
              this.uploadData.impedance = convertResistance(
                this.impedanceMeasurement.measurement.impedance
              )
              uploadOnce()
            }
            if (this.impedanceMeasurement.mode.impedanceStatus === 3) {
              this.uploadData.impedance = 0
              // 没有脱鞋
              setTimeout(() => {
                uploadOnce()
              }, 3000)
              badImpedanceTip()
            }
            if (this.impedanceMeasurement.mode.impedanceStatus === 1) {
              this.uploadData.impedance = 0
              uploadOnce()
              // 阻抗偏低/短路：提示用户脚太湿或者穿了袜子
            }
            if (this.impedanceMeasurement.mode.impedanceStatus === 2) {
              this.uploadData.impedance = 0
              uploadOnce()
              // 阻抗偏大/开路：提示用户脚太干或者穿了绝缘鞋
            }
          }
        }
      }
      if (res.messageType == 'bluetoothEnable') {
        if (res.messageBody.status == 0) {
          debugUtil.log('用户不想开蓝牙')
          this.wantOpenBlue = false
        }
      }
      if (res.messageType == 'singleBlueStatus') {
        if (res.messageBody.status == 1) {
          debugUtil.log('已打开蓝牙')
          this.wantOpenBlue = true
          setTimeout(() => this.start2Connect(), 1500)
        }
      }
      if (res.messageType == 'applicationDidBecomeActive') {
        debugUtil.log('重回页面')
        this.viewappear()
      }
    })
  },
  computed: {
    ...mapState(['userInfo', 'memberList', 'curMember', 'deviceInfo']),
    ...mapGetters(['curAdmin', 'newestRecord', 'curMemberDetail']),
    showWeightNum() {
      if (this.isConnect) {
        if (this.weightMeasurement.measurement.weight == 0) {
          return this.newestRecord.weight
        }
        return (
          this.weightMeasurement.measurement.weight ||
          this.newestRecord.weight ||
          0
        )
      } else {
        return this.newestRecord.weight
      }
    },
    showUpdateTime() {
      if (this.isConnect) {
        return this.weightMeasurement.time || '2002-01-01'
      } else {
        if (this.newestRecord.createTimeStr)
          return this.newestRecord.createTimeStr.substring(0, 10)
        else return '—— ——'
      }
    },
    showTarget() {
      if (this.curMemberDetail)
        return this.curMemberDetail.targetWeight || '— —'
      else return '— —'
    },
    // showBigArea() {
    //   return this.scrollY < -280
    // },
  },
  methods: {
    ...mapActions([
      'init',
      'updateDeviceInfo',
      'initScaleUser',
      'queryScaleUserList',
      'queryScaleWeightHistoryList',
      'saveScaleWeightHistory',
      'getBaseInfo',
    ]),

    onrefresh() {
      this.refreshing = true
      setTimeout(() => {
        this.refreshing = false
        this.showBigArea = false
      }, 800)
    },
    onpullingdown() {},

    async viewappear() {
      this.isView = true
      await this.getBaseInfo()
      const nowTime = {
        pageTime: getNowTime(),
      }
      const firstRecord = await this.queryScaleWeightHistoryList(nowTime)
      debugUtil.log('第一次体重记录获取', firstRecord)
      this.start2Connect()
      const allbar = await this.$bridge.getAllBarHeight()
      debugUtil.log(allbar)
      if (!this.isIos) {
        this.statusBar = allbar.statusBar
      }
      this.bottomArc = allbar.bottomArc
    },

    viewdisappear() {
      this.isView = false
      this.stop2Connect()
      clearTimeout(this.isConnectTimer)
    },

    minibarRightButtonClick() {
      this.$bridge.push({
        url: 'more.js',
      })
    },

    async checkPreSet() {
      if (!this.isIos) {
        const params = {
          type: 'LOCATION',
          needRequest: '1',
        }
        const locationStatus = await this.$bridge.checkAndRequestPermission(
          params
        )
        debugUtil.log('申请位置信息权限', typeof locationStatus)
        const restype = typeof locationStatus
        if (restype === 'string') {
          // 安卓失败
          this.$bridge.pop()
        } else {
          this.checkBlue()
        }
      } else {
        this.checkBlue()
      }
    },

    async checkBlue() {
      const blueStatus = await this.$bridge.getBluetoothStatus()
      debugUtil.log('检查蓝牙状态', blueStatus)
      if (blueStatus.status == '4') {
        debugUtil.log('开始扫描')
        this.start2Connect()
      } else if (blueStatus.status == '3') {
        this.$bridge.showToast('手机不支持蓝牙')
      } else if (blueStatus.status == '2') {
        debugUtil.log('申请授权蓝牙')
        const params = {
          type: 'BLE',
          needRequest: '1',
        }
        await this.$bridge.checkAndRequestPermission(params)
        this.checkBlue()
      } else {
        debugUtil.log('打开蓝牙')
        if (this.wantOpenBlue && !this.isIos) {
          await this.$bridge.blueToothEnable()
          setTimeout(() => this.checkBlue(), 1500)
        } else {
          this.$bridge.showToast('请打开蓝牙')
        }
      }
    },

    tabBarOperateHandler(e) {
      if (e.target.title === 'health') {
        this.$bridge.push({
          url: 'evaluation.js',
        })
      } else {
        this.$bridge.push({
          url: 'babyHold.js',
        })
      }
    },

    getScrollY(e) {
      this.scrollY = e.contentOffset.y
      if (this.scrollY < -300) {
        if (!this.showBigArea) {
          const card = this.$refs.infoCard
          setTimeout(() => {
            domModule.scrollToElement(card, {
              offset: -200,
              animated: true,
            })
          }, 500)
        }
        this.showBigArea = true
      }
      // const area = this.$refs.infoArea
      // if (this.scrollY < -280 && !showBigAreaLock) {

      // }
      // if (this.scrollY > -250 && !showBigAreaLock) {
      //   setTimeout(() => {
      //     this.showBigAreaLock = true
      //     domModule.scrollToElement(area, {
      //       offset: 40,
      //       animated: true,
      //     })
      //   }, 400)
      // }

      // if (this.scrollY > -280 && this.scrollY < -250) {
      //   setTimeout(() => {
      //     domModule.scrollToElement(middle, {
      //       offset: 40,
      //       animated: true,
      //     })
      //   }, 400)
      // }
    },

    start2Connect() {
      singleBlueToothModule.startReceiveBlueAdvertising(
        {
          decryptType: 0,
          id: this.deviceInfo.productId,
        },
        data => {
          debugUtil.log('startReceiveBlueAdvertising', data)
        }
      )
    },

    stop2Connect() {
      singleBlueToothModule.stopReceiveBlueAdvertising({
        id: this.deviceInfo.productId,
      })
    },
    offBack(e) {
      // 选择人物后
      this.viewappear()
      this.offSelector = e
      if (this.offSelector) this.unAble2Scroll = true
    },

    touchOut(e) {
      // debugUtil.log(
      //   '触控反馈',
      //   e.changedTouches[0].pageX,
      //   e.changedTouches[0].pageY
      // )
      // this.tempX = e.changedTouches[0].pageX.toFixed(0)
      // this.tempY = e.changedTouches[0].pageY.toFixed(0)
      if (
        e.changedTouches[0].pageY > 100 &&
        e.changedTouches[0].pageY < 850 &&
        e.changedTouches[0].pageX > 350 &&
        e.changedTouches[0].pageX < 780
      ) {
        // debugUtil.log('保持弹窗')
      } else {
        // debugUtil.log('关闭弹窗')
        this.unAble2Scroll = false
        this.offSelector = false
      }
    },

    async getNewData() {
      const nowTime = {
        pageTime: getNowTime(),
      }
      const firstRecord = await this.queryScaleWeightHistoryList(nowTime)
      debugUtil.log('第一次体重记录获取', firstRecord)
    },
  },
  watch: {
    curMember() {
      debugUtil.log('成员变更')
      this.getNewData()
    },
  },
}
</script>

<style scoped>
.minibar {
  position: fixed;
  top: 0;
}

.fill {
  width: 750px;
}

.title_text {
  font-weight: 500;
  font-size: 36px;
  line-height: 90px;
  color: #000;
}

.gredient {
  position: absolute;
  top: 0;
  left: 0;
}

.content {
  padding-top: 200px;
  align-items: center;
  overflow: hidden;
}

.status {
  position: absolute;
  top: 0;
  left: 375px;
  transform: translateX(-50%);
}

.person {
  padding: 6px 0;
}

.weight {
  position: absolute;
  top: 300px;
  left: 99px;
}

.status_content {
  position: absolute;
  top: 210px;
  width: 750px;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 32px;
  box-sizing: border-box;
  align-items: center;
  margin-bottom: 114px;
}

.search {
  align-items: center;
}

.button {
  width: 120px;
  height: 64px;
  border-radius: 32px;
}

.footer {
  align-items: center;
}

.explain_box {
  padding-left: 48px;
  padding-right: 48px;
}

.explain {
  font-size: 24px;
  color: #8a8a8f;
  letter-spacing: 0;
  line-height: 36px;
  font-weight: 400;
  margin-bottom: 24px;
}

.report {
  width: 686px;
  justify-content: center;
  align-items: center;
}

.zhibiao {
  width: 686px;
}

.body_type {
  background-color: #ffffff;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 32px;
}

.tip {
  margin-bottom: 32px;
  height: 36px;
  font-size: 24px;
  color: #666666;
  letter-spacing: 0;
  line-height: 36px;
}
</style>
