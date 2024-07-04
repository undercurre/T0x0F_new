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

    <div class="date_box">
      <div class="arrow_box" @click="preDate">
        <image class="btn-l" :src="arrowLeft"></image>
      </div>
      <text class="date_text">{{ dateRange }}</text>
      <div class="arrow_box" @click="pushDate">
        <image class="btn-r" :src="arrowRight"></image>
      </div>
    </div>
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
  formatDate,
  formatDate2,
} from '../util'
import debugUtil from '../util/debugUtil'
import arrowLeft from '../assets/image/arrow-left.png'
import arrowRight from '../assets/image/arrow-right.png'

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
    arrowLeft,
    arrowRight,
    curDate: new Date(),
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
        res = getCurrentWeekRange(this.curDate)
      } else if (this.dateType === 'MONTH') {
        res = getCurrentMonthRange(this.curDate)
      } else {
        res = getCurrentYearRange(this.curDate)
      }
      return `${formatDate(res[0])}-${formatDate2(res[1])}`
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
      debugUtil.log('数据长度', dataList.length)
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
        curMaxValue = Number(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            maxWeight,
            maxImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        ).toFixed(2)
        curMinValue = Number(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            minWeight,
            minImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        ).toFixed(2)
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
              : Number(curValue).toFixed(2)
            : 0
        config.y[0].value.push(yVal)
        config.y[0].label.push(parseFloat(yVal).toString())
      }

      curMaxValue = Math.max(...config.y[0].value)
      debugUtil.log('最大值新的', curMaxValue)
      curMinValue = Math.min(...config.y[0].value)
      debugUtil.log('最小值新的', curMinValue)

      this.maxData = curMaxValue > 0 ? curMaxValue : 0
      this.minData = curMinValue > 0 ? curMinValue : 0

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
      let dateArr
      if (this.dateType === 'WEEK') {
        dateArr = getCurrentWeekRange(this.curDate)
      } else if (this.dateType === 'MONTH') {
        dateArr = getCurrentMonthRange(this.curDate)
      } else {
        dateArr = getCurrentYearRange(this.curDate)
      }
      const res = await this.queryScaleWeightByTimes({
        dateType: type,
        startTime: dateArr[0].getTime(),
        endTime: dateArr[1].getTime(),
      })
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
    preDate() {
      if (this.dateType === 'WEEK') {
        // 获取当前日期
        const currentDate = new Date(this.curDate)

        // 获取当前日期的时间戳（毫秒）
        const currentTime = currentDate.getTime()

        // 计算7天前的时间戳（7天 * 24小时 * 60分钟 * 60秒 * 1000毫秒）
        const sevenDaysAgoTime = currentTime - 7 * 24 * 60 * 60 * 1000

        // 创建一个新的Date对象，表示7天前的日期
        const sevenDaysAgoDate = new Date(sevenDaysAgoTime)

        this.curDate = sevenDaysAgoDate
      } else if (this.dateType === 'MONTH') {
        // 获取当前日期
        const currentDate = new Date(this.curDate)

        // 保存当前日期的日期部分
        const currentDay = currentDate.getDate()

        // 设置月份为前一个月
        currentDate.setMonth(currentDate.getMonth() - 1)

        // 如果当前日期的日期部分与新日期的日期部分不相同，说明跨月了，需要手动调整
        if (currentDate.getDate() < currentDay) {
          currentDate.setDate(0) // 设置为上一个月的最后一天
        }

        this.curDate = new Date(currentDate)
      } else {
        // 获取当前日期
        const currentDate = new Date(this.curDate)

        // 使用 setFullYear 方法将年份减1
        currentDate.setFullYear(currentDate.getFullYear() - 1)

        this.curDate = new Date(currentDate)
      }

      this.calData()
    },
    pushDate() {
      const now = new Date()
      const nowTime = now.getTime()
      if (this.dateType === 'WEEK') {
        // 获取当前日期
        const currentDate = new Date(this.curDate)

        // 获取当前日期的时间戳（毫秒）
        const currentTime = currentDate.getTime()

        // 计算7天后的时间戳（7天 * 24小时 * 60分钟 * 60秒 * 1000毫秒）
        const sevenDaysAgoTime = currentTime + 7 * 24 * 60 * 60 * 1000

        // 创建一个新的Date对象，表示7天前的日期
        const sevenDaysAgoDate = new Date(sevenDaysAgoTime)

        const dayOfWeek = now.getDay() // 获取该日期的星期几（0-6，0表示星期日）

        // 根据星期几计算该日期所在周的第一天和最后一天的日期
        const firstDayOfWeek = new Date(
          nowTime - ((dayOfWeek + 6) % 7) * 86400000
        ) // 将时间调整到本周第一天
        const lastDayOfWeek = new Date(firstDayOfWeek.getTime() + 6 * 86400000) // 将时间调整到本周最后一天

        if (sevenDaysAgoDate.getTime() > lastDayOfWeek.getTime()) {
          this.$bridge.showToast('已经是最新的一周')
          return
        }
        this.curDate = sevenDaysAgoDate
      } else if (this.dateType === 'MONTH') {
        // 获取当前日期
        const currentDate = new Date(this.curDate)

        // 设置月份为后一个月
        currentDate.setMonth(currentDate.getMonth() + 1)
        currentDate.setDate(1)

        if (currentDate.getTime() > nowTime) {
          this.$bridge.showToast('已经是最新的一月')
          return
        }

        this.curDate = new Date(currentDate)
      } else {
        // 获取当前日期
        const currentDate = new Date(this.curDate)

        // 使用 setFullYear 方法将年份加1
        currentDate.setFullYear(currentDate.getFullYear() + 1)
        currentDate.setDate(1)

        if (currentDate.getTime() > nowTime) {
          this.$bridge.showToast('已经是最新的一年')
          return
        }

        this.curDate = new Date(currentDate)
      }

      this.calData()
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

.arrow_box {
  width: 70px;
  height: 70px;
  align-items: center;
  justify-content: center;
}

.date_box {
  width: 686px;
  height: 70px;
  line-height: 1.2;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  vertical-align: middle;
}

.btn-l {
  width: 28px;
  height: 28px;
}

.btn-r {
  width: 28px;
  height: 28px;
}
</style>
