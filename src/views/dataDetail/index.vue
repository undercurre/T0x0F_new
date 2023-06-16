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
        <div class="content_wrap" v-if="isFinite(themeValue) && !isNaN(themeValue) && themeValue > 0">
          <div class="data">
            <div class="body_status">
              <text class="body_status_text"
                >目标{{ pageTitle }}: {{ themeTarget }}{{ themeUnit }}</text
              >
            </div>
            <Level :value="themeValue" :theme="themeKey" :unit="themeUnit"></Level>
            <div class="divider"></div>
            <Chart :theme="themeKey"></Chart>
          </div>
          <Advice
            v-if="themeData.level"
            :health="themeLevel.curHealthAdvice"
            :exercise="themeLevel.curExerciseAdvice"
            :nutrition="themeLevel.curEatAdvice"
          ></Advice>
          <text class="define" v-if="themeDefine">{{ themeDefine }}</text>
        </div>
        <div class="content_wrap" v-if="!(isFinite(themeValue) && !isNaN(themeValue) && themeValue > 0)">
          <image :src="lostData" class="lostData"></image>
          <text class="tip">未测量到数据</text>
        </div>
      </div>
    </scroller>
    <dof-minibar
      ref="minibar"
      class="minibar"
      :backgroundColor="scrollY < -100 ? '#fff' : '#fff'"
      @dofMinibarLeftButtonClicked="minibarLeftButtonClick"
    >
      <div slot="left">
        <image
          :src="leftButton"
          style="height: 55px; width: 55px; transform: translateX(-10px)"
        ></image>
      </div>
      <div slot="middle">
        <text class="title_text">详细数据</text>
      </div>
      <div slot="right">
        <text class="history" @click="go2History">历史数据</text>
      </div>
    </dof-minibar>
    <dof-tab-page
      v-if="this.tabTop"
      class="tab"
      :style="{ top: this.tabTop }"
      type="primary"
      :is-slot="false"
      ref="dof-tab-page"
      :tab-checked-index="tabCheckIndex"
      :tab-titles="navTabTitles"
      @dofTabSelected="tabChangeHandler"
    ></dof-tab-page>
  </div>
</template>
<script>
import { DofMinibar, DofTabPage } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import personIcon from '../../assets/image/person.png'
import editIcon from '../../assets/image/edit.png'
import Advice from '../../components/advice.vue'
import Level from '../../components/level.vue'
import Chart from '../../components/chart.vue'
import { reportDataset } from '../../config/report'
import debugUtil from '../../util/debugUtil'
import { mapActions, mapGetters } from 'vuex'
import { getNowTime } from '../../util'
import { weightLevel } from '../../config/level'
import { calculateStandardWeight } from '../../util/algo'
import lostData from '../../assets/image/lostData.png'

const domModule = weex.requireModule('dom')
const detailChannel = new BroadcastChannel('dataDetail')

export default {
  components: {
    DofMinibar,
    DofTabPage,
    Advice,
    Level,
    Chart,
  },
  mixins: [pageBase],
  data: () => ({
    themeKey: '',
    tabCheckIndex: 0,
    scrollY: 0,
    leftButton,
    lostData,
    editIcon,
    personIcon,
    navTabTitles: [
      {
        title: '体重',
      },
    ],
    reportDataset,
    tabTop: 0,
  }),
  async created() {
    this.navTabTitles = this.navTabTitles.concat(
      this.reportDataset.map(item => {
        return {
          title: item.name,
        }
      })
    )
    this.init()
  },
  mounted() {
    setTimeout(() => {
      domModule.getComponentRect(this.$refs.minibar, res => {
        debugUtil.log('minibar', res.size.height)
        if (this.isIos) {
          this.tabTop = res.size.height + this.statusBar + 'px'
        } else {
          this.tabTop = res.size.height + 'px'
        }
        if (res.size.height == 0) this.tabTop = 164 + this.statusBar + 'px'
        debugUtil.log('tabTop', this.tabTop)
      })
    }, 1500)
    detailChannel.onmessage = event => {
      debugUtil.log('接收到频道', event)
      this.themeKey = event.data.key
    }
  },
  computed: {
    ...mapGetters(['newestRecord', 'curMemberDetail']),
    pageTitle() {
      const data = this.reportDataset.find(item => item.key === this.themeKey)
      if (data) return data.name
      else if (this.themeKey === 'weight') return '体重'
      else return '数据分析'
    },
    themeData() {
      const data = this.reportDataset.find(item => item.key === this.themeKey)
      if (data) return data
      else return {}
    },
    themeUnit() {
      const data = this.reportDataset.find(item => item.key === this.themeKey)
      if (data) return data.unit
      else return 'kg'
    },
    themeDefine() {
      const data = this.reportDataset.find(item => item.key === this.themeKey)
      if (data) return data.define
      else return ''
    },
    themeValue() {
      const data = this.reportDataset.find(item => item.key === this.themeKey)
      if (data) {
        let curValue = data.algo(
          this.curMemberDetail.birthday,
          this.curMemberDetail.height,
          this.newestRecord.weight,
          this.newestRecord.impedance,
          this.curMemberDetail.sex === '1' ? 'female' : 'male'
        )
        if (this.themeKey === 'bone') {
          return (curValue = (
            (curValue / this.newestRecord.weight) *
            100
          ).toFixed(2))
        } else {
          return curValue
        }
      } else if (this.themeKey === 'weight') return this.newestRecord.weight
      else return 0
    },
    themeLevel() {
      const data = this.reportDataset.find(item => item.key === this.themeKey)
      if (data && data.level)
        return data.level(
          Number(this.curMemberDetail.sex),
          this.curMemberDetail.age,
          this.themeValue,
          this.newestRecord.weight
        )
      else if (this.theme === 'weight')
        return weightLevel(
          this.newestRecord.weight,
          this.curMemberDetail.height
        )
      else return {}
    },
    themeTarget() {
      let best = 0
      let bestWeight = 0
      debugUtil.log('计算标准', this.curMemberDetail)
      if (this.curMemberDetail && this.curMemberDetail.targetWeight) {
        bestWeight = this.curMemberDetail.targetWeight
      } else {
        const standard = calculateStandardWeight(this.curMemberDetail.height)
        bestWeight = parseInt(
          (standard.standardWeightMax - standard.standardWeightMin) / 2 +
            standard.standardWeightMin
        )
      }
      debugUtil.log('此时的theme', this.themeKey, bestWeight)
      if (
        this.themeKey === 'weight' &&
        Object.keys(this.themeData).length === 0
      ) {
        best = bestWeight
      } else {
        best = parseInt(
          this.themeData.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            bestWeight,
            this.newestRecord.impedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
        if (this.themeKey === 'bone') {
          best = ((best / bestWeight) * 100).toFixed(2)
        }
      }
      return best
    },
  },
  methods: {
    ...mapActions(['getBaseInfo', 'queryScaleWeightHistoryList']),
    async init() {
      await this.getBaseInfo()
      const nowTime = {
        pageTime: getNowTime(),
      }
      const firstRecord = await this.queryScaleWeightHistoryList(nowTime)
      debugUtil.log('健康评估——体重记录获取', firstRecord)
    },
    go2History() {
      this.$bridge.push({
        url: 'history.js',
      })
    },
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
    },
    tabChangeHandler(e) {
      debugUtil.log('手动选取', e.index)
      if (e.index === 0) {
        this.themeKey = 'weight'
      } else {
        this.themeKey = this.reportDataset[e.index - 1].key
      }
    },
  },
  watch: {
    themeKey(val) {
      if (val === 'weight') this.tabCheckIndex = 0
      const themeIndex = this.reportDataset.findIndex(item => item.key === val)
      if (themeIndex > -1) {
        this.tabCheckIndex = themeIndex + 1
      }
      debugUtil.log('主题变更', val, this.tabCheckIndex)
    },
  },
}
</script>

<style scoped>
.minibar {
  position: fixed;
  top: 0;
}

.tab {
  width: 750px;
  margin-bottom: 30px;
  position: fixed;
}

.title_text {
  font-weight: 900;
  font-size: 36px;
  line-height: 90px;
  color: #000;
}

.content {
  background-color: #f9f9f9;
  padding-top: 280px;
  justify-content: space-between;
  align-items: center;
}

.data {
  width: 686px;
  background-color: #ffffff;
  border-radius: 32px;
  margin-bottom: 32px;
  align-items: center;
}

.content_wrap {
  align-items: center;
}

.define {
  margin-top: 32px;
  width: 654px;
  font-size: 24px;
  color: #8a8a8f;
  text-align: justify;
  line-height: 36px;
  font-weight: 400;
  margin-bottom: 43px;
}

.divider {
  margin-top: 35px;
  margin-bottom: 35px;
  width: 622px;
  height: 2px;
  background-color: #8a8a8f;
  opacity: 0.1;
}

.history {
  font-size: 28px;
  color: #000000;
  letter-spacing: 0;
  text-align: right;
  line-height: 28px;
  font-weight: 600;
}

.body_status {
  height: 40px;
  padding: 10px;
  background-color: rgba(38, 122, 255, 0.05);
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin: 24px;
  align-self: flex-start;
}

.body_status_text {
  font-size: 20px;
  color: #267aff;
  line-height: 24px;
  font-weight: 600;
}

.tip {
  margin-top: 40px;
  height: 36px;
  font-size: 24px;
  color: #666666;
  letter-spacing: 0;
  line-height: 36px;
}

.lostData {
  width: 314px;
  height: 224px;
  margin-top: 200px;
}
</style>
