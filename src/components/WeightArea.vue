<template>
  <div class="container">
    <div class="circle_box">
      <image
        class="circle"
        :src="connect ? connectIcon : disconnect"
        style="width: 520px; height: 520px"
      ></image>
      <text class="weight_text">{{ showWeight }}</text>
      <text class="unit_text">体重（{{ unit }}）</text>
      <text class="target_text" @click="go2More">目标体重：{{ target }}kg</text>
    </div>
    <text class="time_text">最近更新{{ time }}</text>
  </div>
</template>

<script>
import pageBase from '../mixins/pageBase'
import disconnect from '../assets/image/disconnect.png'
import connectIcon from '../assets/image/connect.png'

export default {
  components: {},
  props: {
    connect: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      default: 62.1,
    },
    unit: {
      type: String,
      default: 'kg',
    },
    target: {
      type: String,
      default: '— —',
    },
    time: {
      type: String,
      default: '2023-01-30',
    },
  },
  mixins: [pageBase],
  data: () => ({
    disconnect,
    connectIcon,
  }),
  created() {},
  mounted() {},
  computed: {
    showWeight() {
      if (this.unit === 'kg') {
        return this.weight || '— —'
      }

      if (this.unit === '斤') {
        return this.weight * 2 || '— —'
      }

      return this.weight || '— —'
    },
  },
  methods: {
    go2More() {
      this.$bridge.push({
        url: 'more.js',
      })
    },
  },
}
</script>

<style scoped>
.container {
  border-radius: 34px;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  box-sizing: border-box;
}

.circle_box {
  width: 520px;
  height: 520px;
  justify-content: space-around;
  align-items: center;
  padding: 120px;
  box-sizing: border-box;
}

.circle {
  position: absolute;
}

.weight_text {
  font-size: 100px;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  font-weight: 500;
}

.unit_text {
  font-size: 28px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  line-height: 42px;
  font-weight: 400;
}

.target_text {
  width: 208px;
  height: 56px;
  text-align: center;
  font-size: 20px;
  color: #267aff;
  text-align: center;
  line-height: 56px;
  font-weight: 400;
  background-color: rgba(38, 122, 255, 0.06);
  border-radius: 28px;
}

.time_text {
  margin-top: 32px;
  height: 24px;
  font-size: 24px;
  color: #666666;
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 400;
}
</style>
