<!-- eslint-disable prettier/prettier -->
<template>
  <div
    style="background-color: #f9f9f9"
    :is-immersion="true"
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
  >
    <scroller :style="{ height: this.pageHeight }" @scroll="getScrollY">
      <div class="content" :style="{ minHeight: this.pageHeight }">
        <image :src="colorBg" class="bg" style="width: 750px; height: 750px"></image>
        <div class="content_wrap">
          <text class="title">{{ action }}</text>
          <text class="tip" v-if="step !== 4">{{ tip }}</text>
          <div class="count_box">
            <div class="count">
              <text class="count_text">{{ showNum }}</text>
            </div>
            <text class="unit">公斤</text>
          </div>
          <image v-if="step === 0 || step === 1" :src="hold" class="icon"></image>
          <image v-if="step === 2 || step === 3" :src="nohold" class="icon"></image>
          <image v-if="step === 4" :src="baby" class="baby"></image>
        </div>
      </div>
    </scroller>
    <dof-minibar
      class="minibar"
      :backgroundColor="scrollY < -200 ? '#fff' : 'transparent'"
      @dofMinibarLeftButtonClicked="minibarLeftButtonClick"
    >
      <div slot="left">
        <image
          :src="leftButton"
          style="height: 55px; width: 55px; transform: translateX(-10px)"
        ></image>
      </div>
      <div slot="middle">
        <text class="title_text">抱婴称重</text>
      </div>
    </dof-minibar>
  </div>
</template>
<script>
import { DofMinibar } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import personIcon from '../../assets/image/person.png'
import editIcon from '../../assets/image/edit.png'
import { reportDataset } from '../../config/report'
import debugUtil from '../../util/debugUtil'
import hold from '../../assets/image/hold.png'
import nohold from '../../assets/image/nohold.png'
import baby from '../../assets/image/baby.png'
import colorBg from '../../assets/image/colorBg.png'
import { parseBluetoothData } from '../../util/parse'
import { decode } from '../../util/decode'
import { mapState, mapActions } from 'vuex'

const singleBlueToothModule = weex.requireModule('singleBlueToothModule')
const globalEvent = weex.requireModule('globalEvent')

export default {
  components: {
    DofMinibar,
  },
  mixins: [pageBase],
  data: () => ({
    scrollY: 0,
    leftButton,
    editIcon,
    personIcon,
    hold,
    nohold,
    baby,
    colorBg,
    navTabTitles: [
      {
        title: '体重',
      },
    ],
    reportDataset,
    weightShow: 0,
    holdWeight: 0,
    momWeight: 0,
    step: 0, // 0-weight 1-hold 2-weight 3-mom 4-baby
  }),
  async created() {
    this.navTabTitles = this.navTabTitles.concat(
      this.reportDataset.map(item => {
        return {
          title: item.name,
        }
      })
    )
    debugUtil.log(this.navTabTitles)
  },
  mounted() {
    // 蓝牙监听后的相关逻辑
    globalEvent.addEventListener('receiveMessageFromApp', res => {
      debugUtil.log('receiveMessageFromApp', res.messageType, res.messageBody)
      if (res.messageType === 'blueAdvertising') {
        // 检测到蓝牙信号
        if (res.messageBody.id === this.deviceInfo.productId) {
          // 获取解密后的数据
          const decodeData = decode(res.messageBody.data)
          // 语义化
          const parseData = parseBluetoothData(decodeData)
          if (parseData.mode.code === '01') {
            // 体重数据
            this.weightShow = parseData.measurement.weight
            debugUtil.log('体重数据', parseData)
            // 采集稳定数据进行上传
            if (parseData.measurement.isStable) {
              // 没有抱重
              if (this.step === 0) {
                this.holdWeight = parseData.measurement.weight
                this.step = 1
                setTimeout(() => {
                  this.step = 2
                  this.weightShow = 0
                }, 3000)
              }
              // 有抱重没有婴重
              if (this.step === 2) {
                this.momWeight = parseData.measurement.weight
                this.step = 3
                setTimeout(() => {
                  this.step = 4
                  this.weightShow = 0
                }, 3000)
              }
              debugUtil.log('采集到稳定的体重数据', parseData)
            }
          }
        }
      }
    })
  },
  computed: {
    ...mapState(['deviceInfo']),
    babyWeight() {
      if (this.holdWeight !== 0 && this.momWeight !== 0) {
        return (this.holdWeight - this.momWeight).toFixed(2)
      } else {
        return 0
      }
    },
    showNum() {
      if (this.step === 4) return this.babyWeight
      if (this.step === 3) return this.momWeight
      if (this.step === 1) return this.holdWeight
      return this.weightShow
    },
    action() {
      if (this.step === 4) return '宝宝体重'
      if (this.step === 3 || this.step === 2) return '放下宝宝大人再称重'
      return '抱上宝宝称重'
    },
    tip() {
      if (this.step === 3 || this.step === 2)
        return '完成后会自动计算出宝宝的体重'
      return '数字稳定后在放下宝宝称重'
    },
  },
  methods: {
    ...mapActions(['getBaseInfo']),
    async viewappear() {
      await this.getBaseInfo()
      this.start2Connect()
    },
    viewdisappear() {
      this.stop2Connect()
    },
    go2History() {
      this.$bridge.push({
        url: 'history.js',
      })
    },
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
      debugUtil.log(e.contentOffset.y < 200)
    },
    start2Connect() {
      debugUtil.log('抱婴称重——startReceiveBlueAdvertising', this.deviceInfo)
      singleBlueToothModule.startReceiveBlueAdvertising(
        {
          decryptType: 0,
          id: this.deviceInfo.productId,
        },
        data => {
          debugUtil.log('抱婴称重——startReceiveBlueAdvertising', data)
        }
      )
    },

    stop2Connect() {
      singleBlueToothModule.stopReceiveBlueAdvertising({
        id: this.deviceInfo.productId,
      })
    },
  },
}
</script>

<style scoped>
.minibar {
  position: fixed;
  top: 0;
}
.title_text {
  font-weight: 900;
  font-size: 36px;
  line-height: 90px;
  color: #000;
}
.content {
  background-color: #f9f9f9;
  padding-top: 160px;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.content_wrap {
  align-items: center;
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
}
.title {
  margin-top: 60px;
  font-size: 36px;
  color: #000000;
  font-weight: 400;
}
.tip {
  font-size: 26px;
  color: #666666;
  font-weight: 400;
  margin-top: 36px;
}
.count_box {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 62px;
}
.count {
  width: 244px;
  height: 80px;
  border-width: 2px;
  border-style: solid;
  border-color: rgba(219, 220, 225, 1);
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 32px;
}
.count_text {
  font-size: 48px;
  color: #8a8a8f;
  font-weight: 400;
}
.unit {
  font-size: 40px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 400;
}
.icon {
  margin-top: 117px;
  width: 216px;
  height: 700px;
}
.baby {
  margin-top: 160px;
  width: 250px;
  height: 268px;
}
</style>
