<template>
  <div class="container">
    <dof-tab-page
      class="tab"
      type="primary"
      :is-slot="false"
      ref="dof-tab-page"
      :tab-titles="navTabTitles"
      @dofTabSelected="tabChangeHandler"
    ></dof-tab-page>
    <div class="maxminbox">
      <text class="maxmin">最高:{{ maxData || '— —' }}{{ unit }}</text>
      <text class="maxmin">最低:{{ minData || '— —' }}{{ unit }}</text>
    </div>
    <div>
      <div class="barchart-wrapper" v-if="isLoaded">
        <midea-linechart-view
          titleName="周表"
          class="line-chart"
          :data="chartData"
        ></midea-linechart-view>
      </div>
    </div>
    <text class="date_text">{{ dateRange }}</text>
  </div>
</template>
<script>
import chartConfig from '../config/chartConfig'
import { DofTabPage } from 'dolphin-weex-ui'
import { mapActions, mapGetters } from 'vuex'
import { reportDataset } from '../config/report'
import {
  getCurrentWeekRange,
  getCurrentMonthRange,
  getCurrentYearRange,
} from '../util'
import debugUtil from '../util/debugUtil'

export default {
  props: {
    theme: {
      type: String,
      default: 'weight',
    },
  },
  components: {
    DofTabPage,
  },
  data: () => ({
    reportDataset,
    dateType: 'WEEK',
    isLoaded: false,
    maxData: 0,
    minData: 0,
    chartData: null,
    navTabTitles: [
      {
        title: '周',
      },
      {
        title: '月',
      },
      {
        title: '年',
      },
    ],
    unit: '',
  }),
  async created() {
    await this.getBaseInfo()
    this.calData()
  },
  mounted() {},
  computed: {
    ...mapGetters(['newestRecord', 'curMemberDetail', 'curAdmin']),
    dateRange() {
      let res
      if (this.dateType === 'WEEK') {
        res = getCurrentWeekRange()
      } else if (this.dateType === 'MONTH') {
        res = getCurrentMonthRange()
      } else {
        res = getCurrentYearRange()
      }
      return `${res[0]}-${res[1]}`
    },
  },
  watch: {
    theme() {
      this.isLoaded = false
      this.calData()
    },
  },
  methods: {
    ...mapActions(['getBaseInfo', 'queryScaleWeightByTimes']),
    async calData() {
      // 获取默认配置
      this.chartData = null
      let config = chartConfig
      // 重置配置轴
      config.x.value = []
      config.x.label = []
      config.y[0].value = []
      config.y[0].label = []
      const reportItem = this.reportDataset.find(
        item => item.key === this.theme
      )
      // 获取数据
      const resData = await this.getData(this.dateType)
      const dataList = resData.returnData.result.scaleWeightByTimesList
      const maxWeight = resData.returnData.result.maxMinValue.weightMaxValue
      const minWeight = resData.returnData.result.maxMinValue.weightMinValue
      const maxImpedance =
        resData.returnData.result.maxMinValue.impedanceMaxValue
      const minImpedance =
        resData.returnData.result.maxMinValue.impedanceMinValue
      // 映射数据项
      let curMaxValue = 0
      let curMinValue = 0
      if (this.theme === 'weight') {
        curMaxValue = maxWeight
        curMinValue = minWeight
      } else {
        curMaxValue = parseInt(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            maxWeight,
            maxImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
        curMinValue = parseInt(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            minWeight,
            minImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
      }
      this.maxData = curMaxValue > 0 ? curMaxValue : 0
      this.minData = curMinValue > 0 ? curMinValue : 0
      // 装载配置
      let xIndex = 0

      for (let i = 0; i < dataList.length; i++) {
        config.x.value.push(xIndex)
        config.x.label.push(this.time2XLabel(dataList[i].time, this.dateType))
        xIndex++
        let curValue = dataList[i].weight
        if (this.theme !== 'weight') {
          curValue = reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            dataList[i].weight,
            dataList[i].impedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
          if (this.theme === 'bone') {
            curValue = ((curValue / dataList[i].weight) * 100).toFixed(2)
          }
        }
        const yVal =
          parseInt(curValue) > 0
            ? this.theme === 'weight'
              ? curValue
              : parseInt(curValue)
            : 0
        config.y[0].value.push(yVal)
        config.y[0].label.push(parseFloat(yVal).toString())
      }

      if (!isFinite(this.maxData)) this.maxData = 0
      if (!isFinite(this.minData)) this.minData = 0

      // 赋值单位
      if (this.theme === 'weight') {
        config.marker.markerGraduationLabel = 'kg'
        this.unit = 'kg'
      } else {
        config.marker.markerGraduationLabel = reportItem.unit
        this.unit = reportItem.unit
      }
      // 赋值目标
      // let best = 0
      // let bestWeight = 0
      // if (this.curMemberDetail.targetWeight) {
      //   bestWeight = this.curMemberDetail.targetWeight
      // } else {
      //   const standard = calculateStandardWeight(this.curMemberDetail.height)
      //   bestWeight = (
      //     (standard.standardWeightMax - standard.standardWeightMin) / 2 +
      //     standard.standardWeightMin
      //   ).toFixed(0)
      // }
      // if (this.theme === 'weight') {
      //   best = bestWeight
      // } else {
      //   best = parseInt(
      //     reportItem.algo(
      //       this.curMemberDetail.birthday,
      //       this.curMemberDetail.height,
      //       bestWeight,
      //       this.newestRecord.impedance,
      //       this.curMemberDetail.sex === '1' ? 'female' : 'male'
      //     )
      //   )
      //   if (this.theme === 'bone') {
      //     best = ((best / bestWeight) * 100).toFixed(2)
      //   }
      // }

      this.chartData = config
      this.isLoaded = true
    },
    async getData(type) {
      const res = await this.queryScaleWeightByTimes(type)
      if (res.isSuccess) {
        return res
      }
    },
    fillData(data, start, end) {
      // 要填充的日期范围
      debugUtil.log('源数据', data)
      debugUtil.log('填充参数', start, end)
      const startDate = new Date(start)
      const endDate = new Date(end)

      // 填充并排序
      const result = []
      let currentDate = startDate
      for (
        currentDate;
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const isoString = this.formatDateToISO(currentDate)
        const currentDateString = isoString.substring(0, 10)
        const existingData = data.find(d => d.time === currentDateString)
        if (existingData) {
          result.push(existingData)
        } else {
          result.push({
            weight: null,
            impedance: null,
            time: currentDateString,
          })
        }
      }
      result.sort((a, b) => new Date(a.time) - new Date(b.time))
      debugUtil.log('填充结果', result)
      // 输出结果
      return result
    },
    formatDateToISO(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    fillDataOfYear(data) {
      const header = data[0].time.substring(0, 5)
      const startDate = 1
      const endDate = 12

      // 填充并排序
      const result = []
      let currentDate = startDate
      for (currentDate; currentDate <= endDate; currentDate++) {
        const currentDateString =
          header + currentDate.toString().padStart(2, '0')
        const existingData = data.find(d => d.time === currentDateString)
        if (existingData) {
          result.push(existingData)
        } else {
          result.push({
            weight: null,
            impedance: null,
            time: currentDateString,
          })
        }
      }
      result.sort((a, b) => new Date(a.time + '-01') - new Date(b.time + '-01'))
      debugUtil.log('填充结果', result)
      // 输出结果
      return result
    },
    async tabChangeHandler(e) {
      if (e.index === 0) {
        this.dateType = 'WEEK'
      } else if (e.index === 1) {
        this.dateType = 'MONTH'
      } else {
        this.dateType = 'YEAR'
      }
      this.calData()
    },
    time2XLabel(time, type) {
      let date = new Date(time)
      if (type === 'WEEK') {
        const day = date.getDay()
        const arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        return arr[day]
      } else if (type === 'MONTH') {
        return `${date.getDate()}日`
      } else if (type === 'YEAR') {
        return `${date.getMonth() + 1}月`
      }
      return ''
    },
  },
}
</script>

<style scoped>
.container {
  align-items: center;
  padding: 32px;
}

.tab {
  width: 686px;
}

.barchart-wrapper {
  flex-direction: row;
  justify-content: center;
  margin-top: 50px;
  width: 686px;
  height: 600px;
  background-color: #ffffff;
  box-sizing: border-box;
}

.line-chart {
  width: 686px;
  height: 600px;
}

.date_text {
  font-size: 24px;
  color: #666666;
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 400;
  margin-top: 16px;
}

.maxminbox {
  margin-top: 32px;
  width: 626px;
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 48px;
  padding-right: 48px;
  padding-top: 14px;
  padding-bottom: 14px;
  background-color: rgba(242, 242, 242, 0.42);
  border-radius: 14px;
}

.maxmin {
  height: 34px;
  font-size: 24px;
  color: #666666;
  letter-spacing: 0;
  font-weight: 400;
}

.tip {
  font-size: 26px;
  color: #666666;
  font-weight: 400;
  margin-top: 36px;
}
</style>
