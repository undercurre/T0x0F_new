<template>
  <div class="container">
    <text class="search_text">请选择您的生日</text>
    <text class="tip">点击设置出生日期</text>
    <div class="input_box" @click="pickDate">
      <text class="input_text">{{ date }}</text>
    </div>
  </div>
</template>

<script>
import pageBase from '../mixins/pageBase'
const picker = weex.requireModule('picker')
import { formatDate3, getOneHundredYearsAgoDate } from '../util/index'

export default {
  components: {},
  mixins: [pageBase],
  props: {
    date: {
      type: String,
      default: '2000-01-01',
    },
  },
  data: () => ({}),
  async created() {},
  mounted() {},
  computed: {},
  methods: {
    pickDate() {
      const now = new Date()
      const nowStr = formatDate3(now)
      const hundredDate = getOneHundredYearsAgoDate()
      picker.pickDate(
        {
          value: this.date || '2016-11-28',
          max: nowStr,
          min: hundredDate,
          headTitle: '选择日期', //标题
          cancelTxt: '取消', //取消按钮文字
          confirmTxt: '确定', //确定按钮文字,
          cancelTxtColor: '#000000', //取消颜色
          confirmTxtColor: '#000000', //标题颜色
          columnRatios: [3, 1, 2],
        },
        event => {
          var result = event.result
          if (result == 'success') {
            this.$emit('getBirth', event.data)
          }
        }
      )
    },
  },
}
</script>

<style>
.container {
  align-items: center;
}
.search_text {
  font-size: 40px;
  color: #232323;
  letter-spacing: 0;
  font-weight: 900;
  margin-top: 50px;
  margin-bottom: 20px;
}
.tip {
  font-size: 28px;
  color: #666666;
  text-align: center;
  font-weight: 400;
}
.input_box {
  margin-top: 56px;
  width: 562px;
  height: 102px;
  border-width: 2px;
  border-style: solid;
  border-color: #dbdce1;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
}
.input_text {
  font-size: 40px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
}
</style>
