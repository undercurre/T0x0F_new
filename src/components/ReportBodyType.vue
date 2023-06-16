<template>
  <div class="container">
    <div class="col-1">
      <image :src="curBodyType.icon" class="icon"></image>
    </div>
    <div class="col-2">
      <text class="title">{{ curBodyType.name }}</text>
      <text class="define">{{ curBodyType.advice }}</text>
    </div>
  </div>
</template>

<script>
import { bodyType } from '../config/report'
import { mapGetters } from 'vuex'
import { calBodyType } from '../util/algo'
import debugUtil from '../util/debugUtil'

export default {
  components: {},
  data() {
    return {
      errorBodyType: {
        icon: bodyType.Standard.icon,
        name: '暂无数据',
        advice:
          '请确保完善个人信息后，赤脚站在体脂秤上进行测量，我们将为您提供建议分析！',
      },
    }
  },
  computed: {
    ...mapGetters(['newestRecord', 'curMemberDetail']),
    curBodyType() {
      debugUtil.log('计算体型开始')
      if (!this.curMemberDetail) {
        return this.errorBodyType
      }
      if (!this.newestRecord.impedance) {
        return this.errorBodyType
      }
      return calBodyType(
        this.newestRecord.weight,
        this.newestRecord.impedance,
        this.curMemberDetail.height,
        this.curMemberDetail.birthday,
        this.curMemberDetail.sex
      )
    },
  },
  methods: {},
}
</script>

<style scoped>
.container {
  margin-top: 32px;
  padding: 24px;
  padding-right: 46px;
  width: 686px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.col-1 {
  justify-content: center;
  align-items: center;
}

.icon {
  width: 112px;
  height: 144px;
}

.col-2 {
  width: 500px;
  display: flex;
  padding-left: 24px;
  justify-content: space-between;
}
.title {
  font-size: 36px;
  color: #000000;
  font-weight: 700;
  margin-bottom: 10px;
}

.define {
  font-size: 24px;
  color: #666666;
  font-weight: 400;
}
</style>
