<template>
  <div class="container">
    <div class="col-1" @click="go2Detail">
      <div class="value">
        <text class="num">{{ showWeight }}</text>
        <text class="unit">{{ unit }}</text>
        <image :src="upIcon" v-if="updown && !equal" class="icon" />
        <image :src="downIcon" v-if="!updown && !equal" class="icon" />
        <text class="title_compare" v-if="diff"
          >{{ diff > 0 ? '+' : '-' }}{{ Math.abs(diff).toFixed(2)
          }}{{ unit }}</text
        >
      </div>
      <div class="date">
        <text class="newest" v-if="showNewestTime !== '— —'">最新更新</text
        ><text class="newest" v-if="showNewestTime !== '— —'">{{
          showNewestTime
        }}</text>
        <div
          class="body_status"
          :style="{ backgroundColor: conditionBgColor }"
          v-if="condition !== '--'"
        >
          <text
            class="body_status_text"
            :style="{ color: conditionTextColor }"
            >{{ condition }}</text
          >
        </div>
      </div>
    </div>
    <div
      class="more"
      @click="go2History"
      :style="{
        backgroundColor:
          recordList.length === 0
            ? 'rgba(102, 102, 102, 0.1)'
            : 'rgba(38, 122, 255, 0.1)',
      }"
    >
      <text
        class="more_text"
        :style="{
          color: recordList.length === 0 ? '#666666' : '#267aff',
        }"
        >更多记录</text
      >
    </div>
  </div>
</template>

<script lang="js">
import upIcon from '../assets/image/up.png'
import downIcon from '../assets/image/down.png'
import { weightLevel } from '../config/level'
import { mapGetters, mapState } from 'vuex'
import debugUtil from '../util/debugUtil'

const detailChannel = new BroadcastChannel('dataDetail')

export default {
  props: {
    weight: {
      type: Number,
      default: 62.1,
    },
    unit: {
      type: String,
      default: 'kg',
    },
  },
  components: {},
  data() {
    return {
      upIcon,
      downIcon,
      curUser: {},
    }
  },
  computed: {
    ...mapState(['memberList', 'recordList']),
    ...mapGetters(['newestRecord', 'lastRecord', 'curAdmin', 'curMemberDetail']),
    showWeight() {
      if (this.unit === 'kg') {
        return this.weight || '— —'
      }

      if (this.unit === '斤') {
        return this.weight * 2 || '— —'
      }

      return this.weight || '— —'
    },
    updown() {
      const chazhi = this.newestRecord.weight - this.lastRecord.weight
      return chazhi > 0
    },
    equal() {
      const chazhi = this.newestRecord.weight - this.lastRecord.weight
      return chazhi === 0
    },
    diff() {
      let chazhi = 0
      if (this.unit === 'kg')
        chazhi = this.newestRecord.weight - this.lastRecord.weight
      else
        chazhi =  (this.newestRecord.weight - this.lastRecord.weight) * 2
      return chazhi
    },
    showNewestTime() {
      if (this.newestRecord.createTimeStr)
      return this.newestRecord.createTimeStr.substring(0, 16) || '2023-01-30 07:26'
      else
      return '— —'
    },
    condition() {
      if (!this.curMemberDetail) return '--'
      debugUtil.log('健康情况判断', weightLevel(this.newestRecord.weight, this.curMemberDetail.height))
      const conditionDetail = weightLevel(this.newestRecord.weight, this.curMemberDetail.height)
      if (!conditionDetail.bmivalue) return '--'
      if (conditionDetail.curLevelText === '正常') conditionDetail.curLevelText = '健康'
      return conditionDetail.curLevelText || '--'
    },
    conditionBgColor() {
      if (!this.curMemberDetail) return 'rgba(37, 207, 66, 0.1)'
      debugUtil.log('健康情况判断', weightLevel(this.newestRecord.weight, this.curMemberDetail.height))
      const conditionDetail = weightLevel(this.newestRecord.weight, this.curMemberDetail.height)
      if (!conditionDetail.bmivalue) return 'rgba(102, 102, 102, 0.1)'
      if (conditionDetail.curLevelText === '正常') conditionDetail.curLevelText = '健康'
      return conditionDetail.curLevel !== 2 ? 'rgba(255, 59, 48, 0.1)' : 'rgba(37, 207, 66, 0.1)'
    },
    conditionTextColor() {
      if (!this.curMemberDetail) return '#25cf42'
      debugUtil.log('健康情况判断', weightLevel(this.newestRecord.weight, this.curMemberDetail.height))
      const conditionDetail = weightLevel(this.newestRecord.weight, this.curMemberDetail.height)
      if (!conditionDetail.bmivalue) return '#666666'
      if (conditionDetail.curLevelText === '正常') conditionDetail.curLevelText = '健康'
      return conditionDetail.curLevel !== 2 ? '#FF3B30' : '#25cf42'
    }
  },
  methods: {
    go2Detail() {
      this.$bridge.push({
        url: 'dataDetail.js',
      })
      setTimeout(() => {
        debugUtil.log('发送体重详情标签')
        detailChannel.postMessage({ key: 'weight' })
      }, 2000)
    },
    go2History() {
      this.$bridge.push({
        url: 'history.js',
      })
    },
  },
}
</script>

<style scoped>
.container {
  width: 686px;
  height: 192px;
  padding-left: 49px;
  padding-right: 32px;
  padding-top: 32px;
  padding-bottom: 40px;
  background-color: #fff;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 32px;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.col-1 {
  justify-content: space-between;
  height: 120px;
}
.value {
  flex-direction: row;
  align-items: flex-end;
}
.num {
  font-size: 72px;
  line-height: 72px;
  font-weight: 700;
  margin-right: 18px;
}
.unit {
  font-size: 32px;
  line-height: 48px;
  font-weight: 500;
}

.icon {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  margin-left: 20px;
}

.date {
  flex-direction: row;
  align-items: center;
}

.newest {
  height: 36px;
  font-size: 24px;
  color: #666666;
  letter-spacing: 0;
  line-height: 36px;
}

.body_status {
  width: 80px;
  height: 40px;
  background-color: rgba(37, 207, 66, 0.1);
  border-radius: 24px;
  margin-left: 32px;
  justify-content: center;
  align-items: center;
}

.body_status_text {
  font-size: 20px;
  color: #25cf42;
  line-height: 24px;
  font-weight: 600;
}

.more {
  width: 144px;
  height: 56px;
  background-color: rgba(38, 122, 255, 0.1);
  border-radius: 28px;
  justify-content: center;
  align-items: center;
}

.more_text {
  font-size: 24px;
  color: #267aff;
  text-align: center;
  line-height: 24px;
  font-weight: 600;
}

.title_compare {
  color: red;
  margin-bottom: 10px;
}
</style>
