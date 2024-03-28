<template>
  <div class="container">
    <div class="data_list">
      <div
        @click="go2Detail(item)"
        v-for="item in reportDataset"
        :key="item.key"
      >
        <ReportCard
          class="card"
          :value="item.value"
          :name="item.name"
          :updown="item.updown"
          :levelText="item.levelText"
          :isGreen="item.levelColor"
          :icon="item.icon"
        ></ReportCard>
      </div>
    </div>
  </div>
</template>

<script>
import ReportCard from './reportCard'
import { reportDataset } from '../config/report'
import { mapGetters } from 'vuex'
import debugUtil from '../util/debugUtil'

const detailChannel = new BroadcastChannel('dataDetail')

export default {
  components: {
    ReportCard,
  },
  data() {
    return {
      reportDataset,
    }
  },
  created() {
    this.calData()
  },
  mounted() {
    this.reportDataset.forEach(item => {
      Vue.set(item, 'value', '— —')
      Vue.set(item, 'updown', 'equal')
      Vue.set(item, 'levelText', '健康')
      Vue.set(item, 'levelColor', true)
    })
  },
  computed: {
    ...mapGetters(['newestRecord', 'lastRecord', 'curMemberDetail']),
  },
  methods: {
    calData() {
      if (!(this.curMemberDetail && this.newestRecord && this.lastRecord))
        return
      this.reportDataset.forEach(async item => {
        let curValue = await item.algo(
          this.curMemberDetail.birthday,
          this.curMemberDetail.height,
          this.newestRecord.weight,
          this.newestRecord.impedance,
          this.curMemberDetail.sex === '1' ? 'female' : 'male'
        )
        curValue = Number(curValue).toFixed(1)
        if (item.key === 'bmi') debugUtil.log('当前bmi', curValue)
        let lastValue = -1
        if (this.lastRecord.weight) {
          lastValue = await item.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            this.lastRecord.weight,
            this.lastRecord.impedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        }
        lastValue = Number(lastValue).toFixed(1)
        if (item.level) {
          const curLevel = item.level(
            Number(this.curMemberDetail.sex),
            this.curMemberDetail.age,
            curValue,
            this.newestRecord.weight
          )
          item.levelText =
            curLevel.curLevel === 2 ? '健康' : curLevel.curLevelText
          if (
            curLevel.curLevelText === '优' ||
            curLevel.curLevelText === '正常' ||
            curLevel.curLevelText === '标准'
          ) {
            item.levelColor = true
          } else {
            item.levelColor = false
          }
        } else {
          item.levelText = '健康'
          item.levelColor = true
        }
        this.$set(item, 'levelText', item.levelText)
        this.$set(item, 'levelColor', item.levelColor)
        if (curValue === lastValue) item.updown = 'equal'
        if (curValue > lastValue) item.updown = 'up'
        if (curValue < lastValue) item.updown = 'down'
        if (lastValue < 0) item.updown = 'equal'
        this.$set(item, 'updown', item.updown)
        debugUtil.log('是否相等', item.key, curValue, lastValue, item.updown)
        if (isFinite(curValue) && !isNaN(curValue) && curValue > 0) {
          if (item.key === 'bone') {
            item.value = ((curValue / this.newestRecord.weight) * 100).toFixed(
              1
            )
          } else {
            item.value = Number(curValue).toFixed(1)
          }
        } else {
          item.value = '— —'
        }
        this.$set(item, 'value', item.value)
      })
      this.$forceUpdate()
    },
    go2Detail(item) {
      if (item.value === '— —') return
      this.$bridge.push({
        url: 'dataDetail.js',
      })
      setTimeout(() => {
        detailChannel.postMessage({ key: item.key })
      }, 2000)
    },
  },
  watch: {
    newestRecord: {
      handler() {
        debugUtil.log('个人报告更新')
        this.calData()
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.data_list {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.card {
  margin-bottom: 18px;
}
</style>
