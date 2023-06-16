<template>
  <div class="container">
    <div v-if="health">
      <div class="top">
        <image :src="healthIcon" class="icon" />
        <text class="title">健康建议</text>
      </div>
      <text class="content">{{ health }}</text>
    </div>
    <div v-if="exercise" class="divider"></div>
    <div v-if="exercise">
      <div class="top">
        <image :src="exerciseIcon" class="icon" />
        <text class="title">运动建议</text>
      </div>

      <text class="content">{{ exercise }}</text>
    </div>
    <div v-if="nutrition" class="divider"></div>
    <div v-if="nutrition">
      <div class="top">
        <image :src="nutritionIcon" class="icon" />
        <text class="title">饮食建议</text>
      </div>
      <text class="content">{{ nutrition }}</text>
    </div>
  </div>
</template>
<script>
import healthIcon from '../assets/image/advice.png'
import exerciseIcon from '../assets/image/exerciseAdvice.png'
import nutritionIcon from '../assets/image/nutritionAdvice.png'

export default {
  props: {
    health: {
      type: String,
      default: '',
    },
    exercise: {
      type: String,
      default: '',
    },
    nutrition: {
      type: String,
      default: '',
    },
  },
  components: {},
  data: () => ({
    healthIcon,
    exerciseIcon,
    nutritionIcon,
  }),
  async created() {},
  mounted() {},
  computed: {},
  methods: {},
}
</script>

<style scoped>
.container {
  width: 686px;
  background-color: #ffffff;
  border-radius: 24px;
  box-sizing: border-box;
  padding: 32px;
}

.icon {
  width: 48px;
  height: 48px;
  margin-right: 16px;
}

.title {
  height: 36px;
  font-size: 32px;
  color: #000000;
  line-height: 36px;
  font-weight: 900;
}

.top {
  flex-direction: row;
  margin-bottom: 30px;
  align-items: center;
}

.content {
  text-align: justify;
  font-size: 26px;
  color: #8a8a8f;
  font-weight: 400;
}

.divider {
  margin-top: 35px;
  margin-bottom: 35px;
  width: 622px;
  height: 2px;
  background-color: #8a8a8f;
  opacity: 0.1;
}
</style>
