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
        <div class="content_wrap" v-if="dataList.length !== 0">
          <div class="data_list">
            <DofCard class="card" v-for="(item,index) in dataList" :key="item.createTimeStr" :collapsable="true" :collapsed="index !== 0">
                        <div class="title">
                          <div class="title_col_1">
                            <text class="title_date">{{ item.createTimeStr }}</text>
                            <text class="title_weight">体重：{{ item.weight.toFixed(2) }}kg</text>
                          </div>
                          <div class="title_col_2">
                            <image :src="upIcon" v-if="item.diff > 0" class="title_icon" />
                            <image :src="downIcon" v-if="item.diff < 0" class="title_icon" />
                            <text class="title_compare" v-if="item.diff" >{{ item.diff > 0 ? '+' : '-' }}{{ Math.abs(item.diff).toFixed(1) }}kg</text>
                          </div>
                        </div>
                        <div slot="body">
                          <dof-card-item>
                            <div class="body">
                              <text class="body_text">体脂率：{{ item.bodyFat }}%</text>
                              <text class="body_text">BMI：{{ item.bmi }} kg/m²</text>
                              <text class="body_text">身体年龄：{{ item.bodyAge }}</text>
                              <text class="body_text">肌肉率：{{ item.muscle }}%</text>
                              <text class="body_text">内脏脂肪率：{{ item.visceral }}%</text>
                              <text class="body_text">皮下脂肪率：{{ item.subcutaneousIcon }}%</text>
                              <text class="body_text">去脂体重：{{ item.fatFree }} kg</text>
                              <text class="body_text">水分率：{{ item.water }}%</text>
                              <text class="body_text">骨骼率：{{ item.bone === '— —' ? '— —' : (item.bone / item.weight * 100).toFixed(2) }}%</text>
                              <text class="body_text">骨骼肌率：{{ item.boneMuscle }}%</text>
                              <text class="body_text">蛋白质率：{{ item.protein }}%</text>
                              <text class="body_text">基础消耗：{{ item.rate === '— —' ? '— —' : (item.rate * 1).toFixed(0) }}千卡</text>
                              <text class="body_text" v-if="item.bodyFat !== '— —'">体型：{{ item.bodyType }}</text>
                            </div>
                          </dof-card-item>
                        </div>
            </DofCard>
          </div>
        </div>
        <div class="content_wrap" v-if="dataList.length === 0">
          <image :src="noRecord" class="lostData"></image>
          <text class="tip">暂无记录</text>
        </div>
        <date-list v-if="dataList.length !== 0" class="date" @getRule="getRule"></date-list>
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
        <text class="title_text">历史数据</text>
      </div>
    </dof-minibar>
  </div>
</template>
<script>
import { DofMinibar, DofCard, DofCardItem } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import personIcon from '../../assets/image/person.png'
import editIcon from '../../assets/image/edit.png'
import { reportDataset } from '../../config/report'
import DateList from '../../components/DateList.vue'
import debugUtil from '../../util/debugUtil'
import upIcon from '../../assets/image/up.png'
import downIcon from '../../assets/image/down.png'
import { daotui } from '../../util/index'
import { mapActions, mapGetters } from 'vuex'
import { getNowDate, getNowTime } from '../../util'
import { calBodyType } from '../../util/algo'
import noRecord from '../../assets/image/noRecord.png'

export default {
  components: {
    DofMinibar,
    DateList,
    DofCard,
    DofCardItem,
  },
  mixins: [pageBase],
  data: () => ({
    scrollY: 0,
    upIcon,
    downIcon,
    leftButton,
    noRecord,
    editIcon,
    personIcon,
    activeNames_01: [1],
    reportDataset,
    endTime: '',
    dataList: [],
  }),
  async created() {
    await this.getBaseInfo()
    this.endTime = daotui(7)
    await this.getDataList()
  },
  mounted() {},
  computed: {
    ...mapGetters(['curMemberDetail']),
  },
  methods: {
    ...mapActions(['getBaseInfo', 'queryScaleWeightHistoryList']),
    onChange_01(e) {
      this.activeNames_01 = e.name
    },
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
    },
    getRule(e) {
      debugUtil.log('标尺改变', e)
      if (e === 'week') this.endTime = daotui(7)
      if (e === 'month') this.endTime = daotui(30)
      if (e === 'year') this.endTime = daotui(365)
      this.getDataList()
    },
    async getDataList() {
      const time = {
        pageTime: getNowTime(),
        startTime: this.endTime,
        endTime: getNowDate(),
      }
      const record = await this.queryScaleWeightHistoryList(time)
      this.dataList = record.returnData.result.scaleWeightHistoryList
      this.dataList.forEach((item, index, array) => {
        this.reportDataset.forEach(report => {
          if (index < array.length - 1) {
            item.diff = item.weight - array[index + 1].weight
          }
          const curValue = report.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            item.weight,
            item.impedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
          debugUtil.log(
            report.name,
            isFinite(curValue),
            isNaN(curValue),
            curValue
          )
          if (isFinite(curValue) && !isNaN(curValue) && curValue > 0) {
            item[report.key] = curValue
          } else {
            item[report.key] = '— —'
          }
          debugUtil.log('数据计算', report.key, item[report.key])
        })
        item.bodyType = calBodyType(
          item.weight,
          item.impedance,
          this.curMemberDetail.height,
          this.curMemberDetail.birthday,
          this.curMemberDetail.sex
        ).name
      })
      debugUtil.log(this.dataList)
      this.$forceUpdate()
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
  padding-top: 180px;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.content_wrap {
  min-height: 500px;
  align-items: center;
  padding-top: 84px;
}

.history {
  font-size: 28px;
  color: #000000;
  letter-spacing: 0;
  text-align: right;
  line-height: 28px;
  font-weight: 600;
}

.data_list {
  margin-top: 25px;
  margin-bottom: 32px;
}

.date {
  position: absolute;
  top: 170px;
  left: 0;
}

.card {
  width: 686px;
  background-color: #ffffff;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 32px;
  margin-top: 16px;
}

.title {
  flex-direction: row;
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.title_col_1 {
  flex-direction: row;
}

.title_col_2 {
  flex-direction: row;
}

.title_date {
  font-size: 24px;
  color: #000000;
  line-height: 36px;
  font-weight: 400;
}
.title_weight {
  font-size: 26px;
  color: #000000;
  line-height: 36px;
  font-weight: 600;
  margin-left: 16px;
  margin-right: 9px;
}
.title_icon {
  width: 28px;
  height: 28px;
}
.title_compare {
  font-family: PingFangSC-Regular;
  font-size: 24px;
  color: #ff3b30;
  font-weight: 400;
}
.body {
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 32px;
}

.body_text {
  margin-top: 16px;
  margin-bottom: 16px;
  width: 255px;
  font-size: 24px;
  color: #666666;
  line-height: 36px;
  font-weight: 400;
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
  margin-top: 50px;
  width: 314px;
  height: 212px;
}
</style>
