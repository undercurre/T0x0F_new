<template>
  <div class="container">
    <div class="left">
      <div class="left_item1">
        <text class="value">{{ value }}</text>
        <image
          :src="upIcon"
          v-if="updown === 'up' && value !== '— —'"
          class="updown"
        />
        <image
          :src="downIcon"
          v-if="updown === 'down' && value !== '— —'"
          class="updown"
        />
      </div>
      <div class="left_item2">
        <text class="title">{{ name }}</text>
        <div
          v-if="value !== '— —'"
          class="body_status"
          :style="{
            backgroundColor: isGreen
              ? 'rgba(37, 207, 66, 0.1)'
              : 'rgba(255,59,48,0.1)',
          }"
        >
          <text
            class="body_status_text"
            :style="{
              color: isGreen ? '#25cf42' : '#FF3B30',
            }"
            >{{ levelText }}</text
          >
        </div>
      </div>
    </div>
    <div>
      <image :src="icon" class="icon"></image>
    </div>
  </div>
</template>

<script>
import upIcon from '../assets/image/up.png'
import downIcon from '../assets/image/down.png'
import debugUtil from '../util/debugUtil'

export default {
  components: {},
  props: {
    value: {
      type: [Number, String],
      default: '— —',
    },
    name: {
      type: String,
      default: '— —',
    },
    updown: {
      type: String,
      default: 'equal',
    },
    levelText: {
      type: String,
      default: '— —',
    },
    isGreen: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      downIcon,
      upIcon,
    }
  },
  computed: {},
  methods: {},
  created() {},
  watch: {
    value() {
      debugUtil.log('信息卡更新', this.value)
    },
  },
}
</script>

<style scoped>
.container {
  width: 333px;
  height: 152px;
  box-sizing: border-box;
  padding-left: 32px;
  padding-right: 32px;
  padding-top: 40px;
  padding-bottom: 32px;
  background-color: #fff;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.04);
  border-radius: 32px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.left {
  flex: 1;
}

.left_item1 {
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
}

.left_item2 {
  width: 208px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.value {
  font-size: 32px;
  color: #333333;
  line-height: 32px;
  font-weight: 600;
}

.title {
  height: 24px;
  font-size: 24px;
  color: #8a8a8f;
  line-height: 24px;
  font-weight: 400;
}

.updown {
  width: 28px;
  height: 28px;
  margin-left: 16px;
}

.icon {
  width: 64px;
  height: 64px;
}

.body_status {
  width: 80px;
  height: 40px;
  background-color: rgba(37, 207, 66, 0.1);
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
}

.body_status_text {
  font-size: 20px;
  color: #25cf42;
  line-height: 24px;
  font-weight: 600;
}
</style>
