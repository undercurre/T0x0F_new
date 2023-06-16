<template>
  <div
    style="background-color: #f9f9f9"
    :is-immersion="true"
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
  >
    <scroller :style="{ height: this.pageHeight }" @scroll="getScrollY">
      <div class="content" :style="{ minHeight: this.pageHeight }">
        <image
          :src="M2_1"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M2_2"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M2_3"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M2_4"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M2_5"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M2_6"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M2_7"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M2_8"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M2_9"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M2_10"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C2'"
        ></image>
        <image
          :src="M3_1"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_2"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_3"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_4"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_5"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_6"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_7"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_8"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_9"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_10"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_11"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
        <image
          :src="M3_12"
          class="img"
          v-if="deviceInfo.productId === 'MCF-C3'"
        ></image>
      </div>
    </scroller>
    <dof-minibar
      class="minibar"
      backgroundColor="#fff"
      @dofMinibarLeftButtonClicked="minibarLeftButtonClick"
    >
      <div slot="left">
        <image
          :src="leftButton"
          style="height: 55px; width: 55px; transform: translateX(-10px)"
        ></image>
      </div>
      <div slot="middle">
        <text class="title_text">用户手册</text>
      </div>
    </dof-minibar>
  </div>
</template>
<script>
import { DofMinibar } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import M2_1 from '../../assets/image/M2_1.jpg'
import M2_2 from '../../assets/image/M2_2.jpg'
import M2_3 from '../../assets/image/M2_3.jpg'
import M2_4 from '../../assets/image/M2_4.jpg'
import M2_5 from '../../assets/image/M2_5.jpg'
import M2_6 from '../../assets/image/M2_6.jpg'
import M2_7 from '../../assets/image/M2_7.jpg'
import M2_8 from '../../assets/image/M2_8.jpg'
import M2_9 from '../../assets/image/M2_9.jpg'
import M2_10 from '../../assets/image/M2_10.jpg'
import M3_1 from '../../assets/image/M3_1.jpg'
import M3_2 from '../../assets/image/M3_2.jpg'
import M3_3 from '../../assets/image/M3_3.jpg'
import M3_4 from '../../assets/image/M3_4.jpg'
import M3_5 from '../../assets/image/M3_5.jpg'
import M3_6 from '../../assets/image/M3_6.jpg'
import M3_7 from '../../assets/image/M3_7.jpg'
import M3_8 from '../../assets/image/M3_8.jpg'
import M3_9 from '../../assets/image/M3_9.jpg'
import M3_10 from '../../assets/image/M3_10.jpg'
import M3_11 from '../../assets/image/M3_11.jpg'
import M3_12 from '../../assets/image/M3_12.jpg'
import debugUtil from '../../util/debugUtil'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    DofMinibar,
  },
  mixins: [pageBase],
  data: () => ({
    scrollY: 0,
    leftButton,
    M2_1,
    M2_2,
    M2_3,
    M2_4,
    M2_5,
    M2_6,
    M2_7,
    M2_8,
    M2_9,
    M2_10,
    M3_1,
    M3_2,
    M3_3,
    M3_4,
    M3_5,
    M3_6,
    M3_7,
    M3_8,
    M3_9,
    M3_10,
    M3_11,
    M3_12,
  }),
  async created() {
    await this.getBaseInfo()
  },
  mounted() {
    debugUtil.log('高度', this.pageHeight)
  },
  computed: {
    ...mapState(['deviceInfo']),
  },
  methods: {
    ...mapActions(['getBaseInfo']),
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
    },
  },
}
</script>

<style scoped>
.img {
  width: 750px;
  height: 1073px;
}
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
  padding-top: 170px;
  justify-content: space-between;
  align-items: center;
}

.card_list {
  margin: 32px;
}

.card {
  margin-bottom: 24px;
  width: 686px;
  height: 144px;
  background-color: #ffffff;
  border-radius: 32px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 48px;
  padding-right: 38px;
  padding-right: 32px;
  padding-left: 32px;
}

.card_text {
  font-size: 32px;
  color: rgba(0, 0, 0, 0.85);
  letter-spacing: 0;
  font-weight: 400;
  margin-left: 32px;
}

.button {
  margin-bottom: 28px;
}

.left {
  flex-direction: row;
  align-items: center;
}
</style>
