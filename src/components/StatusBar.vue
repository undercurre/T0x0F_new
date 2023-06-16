<template>
  <div class="container">
    <div
      class="point"
      :style="{ backgroundColor: status ? '#25CF42' : '#8A8A8F' }"
    ></div>
    <text class="text">{{ status ? '已连接' : '未连接' }}</text>
  </div>
</template>

<script>
import pageBase from '../mixins/pageBase'

export default {
  components: {},
  props: {
    status: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [pageBase],
  data: () => ({}),
  created() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style scoped>
.container {
  width: 178px;
  height: 68px;
  background-color: rgba(102, 102, 102, 0.08);
  border-radius: 34px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 321px 20px;
  box-sizing: border-box;
}

.point {
  width: 14px;
  height: 14px;
  border-radius: 7px;
  margin-right: 16px;
}

.text {
  font-size: 28px;
  color: #666666;
  letter-spacing: 0;
  line-height: 28px;
  font-weight: 700;
}
</style>
