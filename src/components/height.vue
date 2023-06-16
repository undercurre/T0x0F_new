<template>
  <div class="container">
    <text class="search_text">请输入您的身高</text>
    <ruler
      :wrapWidth="750"
      :listArray="heightList"
      :itemIndex="height"
      :max="250"
      :min="25"
      @onChange="choseHeight"
      class="ruler"
    ></ruler>
    <div class="res_box">
      <text class="num">{{ height }}</text>
      <text class="unit">cm</text>
    </div>
    <!-- <div class="tip">
      <text class="tip_text">您的最佳体重</text>
    </div> -->
  </div>
</template>

<script>
import pageBase from '../mixins/pageBase'
// eslint-disable-next-line no-unused-vars
import debugUtil from '../util/debugUtil'
import ruler from './ruler.vue'

export default {
  components: {
    ruler,
  },
  mixins: [pageBase],
  props: {
    height: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    heightList: [],
  }),
  async created() {
    for (let index = 0; index < 274; index++) {
      this.heightList.push({ index: index, value: index })
    }
  },
  mounted() {},
  computed: {},
  methods: {
    choseHeight(res) {
      debugUtil.log('标尺反馈', res)
      this.$emit('getHeight', res.index)
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
  margin-bottom: 112px;
}
.ruler {
  margin-bottom: 64px;
}
.res_box {
  flex-direction: row;
}
.num {
  font-size: 72px;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  line-height: 100px;
  font-weight: 700;
}
.unit {
  margin-left: 10px;
  font-size: 40px;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  line-height: 100px;
  transform: translateY(12px);
  font-weight: 600;
}
</style>
