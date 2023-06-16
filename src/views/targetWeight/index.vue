<template>
  <div
    style="background-color: #f9f9f9"
    :is-immersion="true"
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
  >
    <scroller :style="{ height: this.pageHeight }" @scroll="getScrollY">
      <div class="content" :style="{ minHeight: this.pageHeight }">
        <div class="search">
          <weight
            v-if="isLoaded"
            @getWeight="getWeight"
            :weight="weig"
          ></weight>
        </div>
        <div class="footer">
          <dof-button
            text="保存"
            type="primary"
            size="full"
            @dofButtonClicked="save"
          ></dof-button>
          <div :style="{ height: bottomArc }"></div>
        </div>
      </div>
    </scroller>
    <dof-minibar
      class="minibar"
      :backgroundColor="scrollY < -200 ? '#fff' : 'transparent'"
      @dofMinibarLeftButtonClicked="minibarLeftButtonClick"
    >
      <div slot="left">
        <image
          :src="leftButton"
          style="height: 55px; width: 55px; transform: translateX(-10px)"
        ></image>
      </div>
      <div slot="middle">
        <text class="title_text">目标体重</text>
      </div>
    </dof-minibar>
  </div>
</template>
<script>
import { DofMinibar, DofButton } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import weight from '../../components/weight.vue'
import { mapActions, mapGetters } from 'vuex'
import { calculateStandardWeight } from '../../util/algo'
import debugUtil from '../../util/debugUtil'

export default {
  components: {
    DofMinibar,
    DofButton,
    weight,
  },
  mixins: [pageBase],
  data: () => ({
    scrollY: 0,
    //TODO: 解释型号是什么型号的什么设备在配网
    leftButton,
    weig: 120,
    isLoaded: false,
  }),
  async created() {},
  async mounted() {
    await this.getBaseInfo()
    if (!this.curAdmin.targetWeight) {
      const standard = calculateStandardWeight(this.curAdmin.height)
      this.weig = (
        (standard.standardWeightMax - standard.standardWeightMin) / 2 +
        standard.standardWeightMin
      ).toFixed(0)
      debugUtil.log('计算好最佳体重目标', this.weig)
    } else {
      this.weig = this.curAdmin.targetWeight
      debugUtil.log('计算好最佳体重目标', this.weig)
    }
    this.isLoaded = true
  },
  computed: {
    ...mapGetters(['curAdmin', 'curMemberDetail']),
  },
  methods: {
    ...mapActions(['getBaseInfo', 'uptScaleUser']),
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
    },
    getWeight(e) {
      debugUtil.log('目标体重选择', e)
      this.weig = e
    },
    async save() {
      const userInfo = {
        scaleUserId: this.curMemberDetail.scaleUserId,
        username: this.curMemberDetail.username,
        height: this.curMemberDetail.height,
        sex: this.curMemberDetail.sex,
        birthday: this.curMemberDetail.birthday,
        targetWeight: this.weig,
      }

      const res = await this.uptScaleUser(userInfo)
      debugUtil.log('修改结果', res)

      // tode: 跳到首页
      if (res.isSuccess) {
        this.$bridge.pop()
      }
    },
  },
}
</script>

<style scoped>
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
  padding-top: 240px;
  justify-content: space-between;
  align-items: center;
}
.search {
  align-items: center;
}
.footer {
  align-items: center;
}
</style>
