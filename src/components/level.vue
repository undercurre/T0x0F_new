<template>
  <div class="container">
    <div class="row1">
      <div class="row1_title">
        <text class="num">{{ value }}</text>
        <text class="unit">{{ unit }}</text>
      </div>
      <div
        class="body_status"
        v-if="Object.keys(themeLevel).length"
        :style="{
          backgroundColor: isGreen
            ? 'rgba(37, 207, 66, 0.1)'
            : 'rgba(255,59,48,0.1)',
        }"
      >
        <text
          class="body_status_text"
          :style="{
            color: isGreen ? '#25cf42' : '#FF3B30',
          }"
          >{{
            themeLevel.curLevel !== 2 ? themeLevel.curLevelText : '健康'
          }}</text
        >
      </div>
    </div>
    <div class="row2">
      <text class="compare_text" v-if="chazhi !== 0"
        >较上一次{{ chazhi > 0 ? '增加' : '减少' }}了{{ Math.abs(chazhi)
        }}{{ unit }}</text
      >
      <image :src="upIcon" v-if="chazhi > 0" class="updown" />
      <image :src="downIcon" v-if="chazhi < 0" class="updown" />
    </div>
    <div v-if="Object.keys(themeLevel).length && theme !== 'weight'">
      <div class="row3">
        <div class="data_item" v-if="themeLevel.levelText[0]">
          <div class="data_low"></div>
          <text class="data_text">{{ themeLevel.levelText[0] }}</text>
        </div>
        <div class="data_item" v-if="themeLevel.levelText[1]">
          <div class="data_standard"></div>
          <text class="data_text">{{ themeLevel.levelText[1] }}</text>
        </div>
        <div class="data_item" v-if="themeLevel.levelText[2]">
          <div class="data_high"></div>
          <text class="data_text">{{ themeLevel.levelText[2] }}</text>
        </div>
        <div class="data_item" v-if="themeLevel.levelText[3]">
          <div class="data_higher"></div>
          <text class="data_text">{{ themeLevel.levelText[3] }}</text>
        </div>
        <div
          class="point"
          :style="{ left: pointLocation, backgroundColor: pointColor }"
        ></div>
        <text v-if="this.curMemberDetail.sex === '1'" class="catch1">{{
          themeLevel.levelGirl[0]
        }}</text>
        <text v-if="this.curMemberDetail.sex === '1'" class="catch2">{{
          themeLevel.levelGirl[1]
        }}</text>
        <text
          v-if="this.curMemberDetail.sex === '1' && themeLevel.levelGirl[2]"
          class="catch3"
          >{{ themeLevel.levelGirl[2] }}</text
        >
        <text v-if="this.curMemberDetail.sex === '0'" class="catch1">{{
          themeLevel.levelBoy[0]
        }}</text>
        <text v-if="this.curMemberDetail.sex === '0'" class="catch2">{{
          themeLevel.levelBoy[1]
        }}</text>
        <text
          v-if="this.curMemberDetail.sex === '0' && themeLevel.levelBoy[2]"
          class="catch3"
          >{{ themeLevel.levelBoy[2] }}</text
        >
      </div>
    </div>
  </div>
</template>
<script>
import upIcon from '../assets/image/up.png'
import downIcon from '../assets/image/down.png'
import { reportDataset } from '../config/report'
import { mapGetters } from 'vuex'
import { weightLevel } from '../config/level'
import debugUtil from '../util/debugUtil'

export default {
  components: {},
  props: {
    value: {
      type: Number,
      default: 0,
    },
    theme: {
      type: String,
      default: '',
    },
    unit: {
      type: String,
      default: '%',
    },
  },
  data: () => ({
    upIcon,
    downIcon,
    reportDataset,
  }),
  async created() {},
  mounted() {},
  computed: {
    ...mapGetters(['newestRecord', 'lastRecord', 'curMemberDetail']),
    themeLevel() {
      const data = this.reportDataset.find(item => item.key === this.theme)
      if (data && data.level) {
        debugUtil.log(
          '当前Level1',
          data.level(
            Number(this.curMemberDetail.sex),
            this.curMemberDetail.age,
            this.value,
            this.newestRecord.weight
          )
        )
        const curLevel = data.level(
          Number(this.curMemberDetail.sex),
          this.curMemberDetail.age,
          this.value,
          this.newestRecord.weight
        )

        if (this.theme === 'bone') {
          curLevel.levelBoy[0] = curLevel.levelBoy[0] = (
            (curLevel.levelBoy[0] / this.newestRecord.weight) *
            100
          ).toFixed(2)
          curLevel.levelBoy[1] = curLevel.levelBoy[1] = (
            (curLevel.levelBoy[1] / this.newestRecord.weight) *
            100
          ).toFixed(2)
          curLevel.levelGirl[0] = curLevel.levelGirl[0] = (
            (curLevel.levelGirl[0] / this.newestRecord.weight) *
            100
          ).toFixed(2)
          curLevel.levelGirl[1] = curLevel.levelGirl[1] = (
            (curLevel.levelGirl[1] / this.newestRecord.weight) *
            100
          ).toFixed(2)
        }

        return curLevel
      } else if (this.theme === 'weight') {
        debugUtil.log(
          '当前Level2',
          weightLevel(this.newestRecord.weight, this.curMemberDetail.height)
        )
        return weightLevel(
          this.newestRecord.weight,
          this.curMemberDetail.height
        )
      } else {
        debugUtil.log('当前Level3', {})
        return {}
      }
    },
    themeLastValue() {
      const data = this.reportDataset.find(item => item.key === this.theme)
      if (data) {
        let curValue = data.algo(
          this.curMemberDetail.birthday,
          this.curMemberDetail.height,
          this.lastRecord.weight,
          this.lastRecord.impedance,
          this.curMemberDetail.sex === '1' ? 'female' : 'male'
        )
        if (this.theme === 'bone') {
          return (curValue = (
            (curValue / this.lastRecord.weight) *
            100
          ).toFixed(2))
        } else {
          return curValue
        }
      } else if (this.theme === 'weight') return this.lastRecord.weight
      else return 0
    },
    chazhi() {
      if (this.lastRecord.weight <= 0) return 0
      if (isNaN(this.value - this.themeLastValue) || this.themeLastValue < 0)
        return 0
      return (this.value - this.themeLastValue).toFixed(1)
    },
    isGreen() {
      if (
        this.themeLevel.curLevelText === '优' ||
        this.themeLevel.curLevelText === '正常' ||
        this.themeLevel.curLevelText === '标准'
      ) {
        return true
      } else {
        return false
      }
    },
    pointLocation() {
      // 单条158px
      // 先判断在第几条
      let location = 0
      let curtiao = 0
      if (this.themeLevel.levelText[0]) {
        curtiao = this.themeLevel.curLevel
      } else {
        curtiao = this.themeLevel.curLevel - 1
      }
      location = (curtiao - 1) * 158
      debugUtil.log('点移动1', location, curtiao)
      // 所在条两端的数值差
      let chazhi = 0
      // 点与条始点的差值
      let pchazhi = 0
      // 选取标准
      const biaozhun =
        this.curMemberDetail.sex === '0'
          ? this.themeLevel.levelBoy
          : this.themeLevel.levelGirl
      // 如果处于第一条
      debugUtil.log('点移动2', biaozhun)
      if (curtiao === 1) {
        chazhi = biaozhun[0]
        pchazhi = this.value
        debugUtil.log('点移动3', chazhi, pchazhi)
      } else {
        if (curtiao - 1 > biaozhun.length - 1) {
          chazhi = biaozhun[1] - biaozhun[0]
        } else {
          chazhi = biaozhun[curtiao - 1] - biaozhun[curtiao - 2]
        }
        pchazhi = this.value - biaozhun[curtiao - 2]
        debugUtil.log('点移动4', location, chazhi, pchazhi)
      }
      // 在所在条右移
      let rightcur = 0
      if (pchazhi < chazhi) {
        rightcur = (pchazhi / chazhi) * 150
        debugUtil.log('滑动条右端移动了', rightcur)
      } else {
        rightcur = 150
      }
      // 12是point的半径
      location = location + rightcur - 12
      debugUtil.log('点移动', location)
      return location + 'px'
    },
    pointColor() {
      const colors = ['#29c3ff', '#25cf42', '#ff8225', '#ff3b30']
      return colors[this.themeLevel.curLevel - 1]
    },
  },
  methods: {},
}
</script>

<style scoped>
.container {
  margin-top: 36px;
  margin-bottom: 47px;
  align-items: center;
}
.row1 {
  width: 500px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.row1_title {
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
}
.row2 {
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
.row3 {
  height: 160px;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
}
.data_item {
  align-items: center;
  margin-top: 8px;
}
.data_text {
  font-size: 24px;
  color: #8a8a8f;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
}
.data_low {
  width: 150px;
  height: 8px;
  background-color: #29c3ff;
  margin-bottom: 14px;
  margin-right: 8px;
}
.data_standard {
  width: 150px;
  height: 8px;
  background-color: #25cf42;
  margin-bottom: 14px;
  margin-right: 8px;
}
.data_high {
  width: 150px;
  height: 8px;
  background-color: #ff8225;
  margin-bottom: 14px;
  margin-right: 8px;
}
.data_higher {
  width: 150px;
  height: 8px;
  background-color: #ff3b30;
  margin-bottom: 14px;
  margin-right: 8px;
}
.point {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  position: absolute;
  background-color: #25cf42;
  border-width: 4px;
  border-style: solid;
  border-color: #fff;
  box-sizing: border-box;
  left: 0px;
  bottom: 34px;
}

.catch1 {
  position: absolute;
  font-size: 28px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
  bottom: 70px;
  left: 138px;
}

.catch2 {
  position: absolute;
  font-size: 28px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
  bottom: 70px;
  left: 300px;
}

.catch3 {
  position: absolute;
  font-size: 28px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
  bottom: 70px;
  left: 450px;
}
.compare_text {
  font-size: 24px;
  color: #8a8a8f;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
  margin-right: 16px;
}
.num {
  font-size: 80px;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  font-weight: 500;
}
.updown {
  width: 28px;
  height: 28px;
}
.body_status {
  width: 80px;
  height: 40px;
  background-color: rgba(37, 207, 66, 0.1);
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
}

.body_status_text {
  font-size: 20px;
  color: #25cf42;
  line-height: 24px;
  font-weight: 600;
}

.unit {
  height: 36px;
  line-height: 24px;
  font-size: 24px;
  color: #000000;
  margin-right: 24px;
}
</style>
