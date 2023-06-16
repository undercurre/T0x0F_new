<template>
  <div :style="wrapStyle">
    <scroller
      scroll-direction="horizontal"
      class="scroller"
      offset-accuracy="5"
      :show-scrollbar="false"
      @scroll="scroll"
      @touchend="handleEnd"
    >
      <div style="width: 375px"></div>
      <div
        v-for="(item, index) in listArray"
        :key="index"
        ref="item"
        class="item"
      >
        <div
          class="list-item"
          :style="
            item.value % 10 === 0 && item.value % 5 === 0
              ? longStyle
              : item.value % 5 === 0
              ? middleStyle
              : shortStyle
          "
        ></div>
        <text v-if="index % 10 === 0" class="item-text">{{ item.value }}</text>
      </div>
      <div style="width: 375px"></div>
    </scroller>
    <div class="select-item"></div>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import debugUtil from '../util/debugUtil'

const dom = weex.requireModule('dom')

export default {
  props: {
    listArray: {
      type: Array,
      default: function () {
        return []
      },
    },
    itemIndex: {
      type: Number,
      default: null,
    },
    wrapHeight: {
      type: Number,
      default: 400,
    },
    wrapWidth: {
      type: Number,
      default: 750,
    },
    isShowIndicator: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    labelOffset: {
      type: Number,
      default: null,
    },
    align: {
      type: String,
      default: 'center', // 'center'/'left'
    },
    max: {
      type: Number,
      default: 100,
    },
    min: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    wrapStyle() {
      return {
        width: this.wrapWidth,
        height: this.wrapHeight,
      }
    },
    selectedItemTop() {
      return this.innerIndex * this.itemHeight
    },
    indicatorStyle() {
      return {
        top: this.selectedItemTop + 'px',
        width: this.wrapWidth,
        height: this.itemHeight + 2,
      }
    },
    labelStyle() {
      return {
        top: this.selectedItemTop + 'px',
        left: this.labelOffset ? this.labelOffset : this.wrapWidth / 2 + 50,
        width: this.wrapWidth / 2,
        height: this.itemHeight,
      }
    },
    scrollerStyle() {
      return {
        width: this.wrapWidth,
        height: this.wrapHeight,
      }
    },
    longStyle() {
      return {
        width: '4px',
        height: '72px',
      }
    },
    middleStyle() {
      return {
        width: '2px',
        height: '60px',
      }
    },
    shortStyle() {
      return {
        width: '2px',
        height: '48px',
      }
    },
  },
  data() {
    return {
      isScrolling: false,
      scrollingtimer: null,
      isInit: false,
      itemHeight: 13.7,
      innerIndex: 0,
      handler: null,
      intervalHandler: null,
      isFixing: false,
      fixingTimer: null,
    }
  },
  watch: {
    itemIndex(value) {
      this.innerIndex = value
    },
  },
  methods: {
    scroll(event) {
      if (!this.isInit) return
      this.isScrolling = true
      // ios越界
      if (event.contentOffset.x > 0) {
        this.innerIndex = 0
      } else if (event.contentOffset.x < 750 - event.contentSize.width) {
        this.innerIndex = this.listArray.length - 1
      } else {
        // 计算当前滚动到的下标
        this.innerIndex = Math.abs(
          Math.round(
            ((event.contentOffset.x || 0) / (event.contentSize.width - 750)) *
              this.listArray.length
          )
        )
      }
      // 安卓越界
      if (this.innerIndex >= this.listArray.length) {
        this.innerIndex = this.listArray.length - 1
      }
      this.$emit('onChange', this.listArray[this.innerIndex])
      // // 处理滚动超过边界时，不触发scrollEnd的问题 2019-08-02 Ken Added Start***
      // if (weex.config.env.platform === 'android') {
      //   if (this.handler) {
      //     clearTimeout(this.handler)
      //   }
      //   this.handler = setTimeout(() => {
      //     this.$emit('onChange', this.listArray[this.innerIndex])
      //   }, 500)
      // }
      // 处理滚动超过边界时，不触发scrollEnd的问题 2019-08-02 Ken Added End***
    },
    scrollToIndexItem(index, animated = true) {
      this.isScrolling = false
      const el = this.$refs.item[index]
      if (el) {
        dom.getComponentRect(el, options => {
          if (options.result && options.size.right) {
            dom.scrollToElement(el, {
              animated: animated,
              offset: -(750 / 47) * 22.5,
            })
            if (this.isInit) {
              this.$emit('onChange', this.listArray[this.innerIndex])
            }
          } else {
            setTimeout(() => {
              this.scrollToIndexItem(index, animated)
            }, 700)
          }
        })
      }
    },
    handleEnd() {
      this.time2Scroll()
    },
    time2Scroll() {
      if (this.isScrolling) {
        clearTimeout(this.scrollingtimer)
        this.scrollertimer = setTimeout(() => {
          this.scrollToIndexItem(this.innerIndex, true)
        }, 700)
      } else {
        this.scrollToIndexItem(this.innerIndex, true)
      }
    },
  },
  mounted() {
    if (this.itemIndex != null) {
      this.scrollToIndexItem(this.itemIndex, false)
    }
    setTimeout(() => {
      this.isInit = true
    }, 1000)
  },
}
</script>

<style>
.wrap {
  position: relative;
  background-color: transparent;
}
.scroller {
  flex: 1;
  flex-direction: row;
  align-content: center;
  align-items: center;
  background-color: transparent;
}
.item {
  width: 44px;
  height: 200px;
  align-items: center;
  justify-content: flex-end;
  margin-left: -14px;
  margin-right: -14px;
}
.list-item {
  background-color: #ddd;
  margin-bottom: 44px;
}
.item-text {
  font-size: 24px;
  position: absolute;
  bottom: 0;
  color: #666666;
  font-weight: 600;
}
.select-item {
  width: 12px;
  border-radius: 6px;
  height: 96px;
  background-color: #267aff;
  position: absolute;
  left: 375px;
  bottom: 140px;
}
</style>
