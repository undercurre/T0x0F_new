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
        <div v-if="!newestRecord.impedance > 0">
          <text class="tip">暂无数据支撑健康评估</text>
        </div>
        <div v-if="newestRecord.impedance > 0" class="content_wrap">
          <div class="result">
            <div class="result_title">
              <image :src="evaluation" class="icon" />
              <text class="title_text">评估结果</text>
            </div>
            <ReportBodyType></ReportBodyType>
          </div>
          <div class="risk">
            <div class="risk_title">
              <image :src="risk" class="icon" />
              <text class="title_text">风险解读</text>
            </div>
            <div v-for="(item, index) in risks" :key="item.key">
              <div v-if="index !== 0" class="divider"></div>
              <text class="title_text">{{ item.summary }}</text>
              <text class="info_text">{{ item.advice }}</text>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <dof-minibar
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
        <text class="top_text">健康评估</text>
      </div>
    </dof-minibar>
  </div>
</template>
<script>
import { DofMinibar } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import debugUtil from '../../util/debugUtil'
import ReportBodyType from '../../components/ReportBodyType.vue'
import evaluation from '../../assets/image/evaluation.png'
import risk from '../../assets/image/risk.png'
import { mapActions, mapGetters } from 'vuex'
import { getNowTime } from '../../util'
import { reportDataset } from '../../config/report'

export default {
  components: {
    DofMinibar,
    ReportBodyType,
  },
  mixins: [pageBase],
  data: () => ({
    scrollY: 0,
    leftButton,
    evaluation,
    risk,
    reportDataset,
    risks: [],
  }),
  async created() {
    this.init()
  },
  mounted() {},
  computed: {
    ...mapGetters(['newestRecord', 'curMemberDetail']),
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
      this.calData()
    },
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
    },
    calData() {
      debugUtil.log('风险计算开始', this.newestRecord)
      this.reportDataset.forEach(item => {
        const itemValue = item.algo(
          this.curMemberDetail.birthday,
          this.curMemberDetail.height,
          this.newestRecord.weight,
          this.newestRecord.impedance,
          this.curMemberDetail.sex === '1' ? 'female' : 'male'
        )
        debugUtil.log(`${item.name}数值`, itemValue)
        if (!item.level) return
        const levelRes = item.level(
          Number(this.curMemberDetail.sex),
          this.curMemberDetail.age,
          itemValue,
          this.newestRecord.weight
        )
        debugUtil.log(`${item.name}等级`, levelRes)
        if (item.key === 'muscle' && levelRes.curLevel > 2) return
        if (item.key === 'bone' && levelRes.curLevel > 2) return
        if (item.key === 'boneMuscle' && levelRes.curLevel > 2) return
        if (levelRes.curLevel !== 2) {
          this.risks.push({
            key: item.key,
            summary: `${item.name}${levelRes.curLevel > 2 ? '偏高' : '偏低'}`,
            advice: levelRes.curHealthAdvice,
          })
          debugUtil.log('风险点插入', this.risks)
        }
        debugUtil.log(`${item.name}循环结束`)
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
.top_text {
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
}
.content_wrap {
  align-items: center;
}
.result {
  width: 686px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 32px;
  margin-top: 32px;
}
.result_title {
  flex-direction: row;
  align-items: center;
  padding: 32px;
  padding-bottom: 0px;
}

.result_text {
  font-size: 32px;
  color: #000000;
  line-height: 36px;
  font-weight: 600;
}

.icon {
  width: 48px;
  height: 48px;
  margin-right: 16px;
}

.title_text {
  font-size: 32px;
  color: #000000;
  line-height: 36px;
  font-weight: 600;
}

.info_text {
  margin-top: 16px;
  font-size: 26px;
  color: #8a8a8f;
  text-align: justify;
  font-weight: 400;
}

.risk {
  background-color: #ffffff;
  padding: 32px;
  box-sizing: border-box;
  border-radius: 32px;
  width: 686px;
  margin-top: 32px;
  margin-bottom: 32px;
}

.risk_title {
  flex-direction: row;
  align-items: center;
  padding-bottom: 32px;
}

.divider {
  margin-top: 35px;
  margin-bottom: 35px;
  width: 622px;
  height: 2px;
  background-color: #8a8a8f;
  opacity: 0.1;
}

.tip {
  margin-top: 40px;
  height: 36px;
  font-size: 24px;
  color: #666666;
  letter-spacing: 0;
  line-height: 36px;
}
</style>
