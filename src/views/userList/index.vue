<template>
  <div
    style="background-color: #f9f9f9"
    :is-immersion="true"
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
  >
    <scroller :style="{ height: this.pageHeight }" @scroll="getScrollY">
      <div class="content" :style="{ minHeight: this.pageHeight }">
        <div class="card_list">
          <div
            v-for="item in memberList"
            :key="item.scaleUserId"
            class="card"
            @click="go2Edit(item)"
          >
            <div class="left">
              <image
                :src="item.headImageUrl ? item.headImageUrl : persionIcon"
                style="width: 80px; height: 80px; border-radius: 40px"
              ></image>
              <text class="card_text">{{ item.username }}</text>
            </div>
            <DofIcon
              :iconStyle="{
                fontSize: '25px',
                fontWeight: 900,
                color: '#C8C7CC ',
              }"
              name="more"
            ></DofIcon>
          </div>
        </div>
        <div>
          <DofButton
            class="button"
            type="primary"
            size="full"
            @dofButtonClicked="go2Add"
            text="+ 添加成员"
          ></DofButton>
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
        <text class="title_text">家庭成员</text>
      </div>
    </dof-minibar>
  </div>
</template>
<script>
import { DofMinibar, DofButton, DofIcon } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import persionIcon from '../../assets/image/person.png'
import { mapActions, mapState } from 'vuex'
import debugUtil from '../../util/debugUtil'

const userEditChannel = new BroadcastChannel('userEdit')

export default {
  components: {
    DofMinibar,
    DofButton,
    DofIcon,
  },
  mixins: [pageBase],
  data: () => ({
    scrollY: 0,
    leftButton,
    persionIcon,
    card: {
      borderRadius: '32px',
    },
  }),
  async created() {
    await this.getBaseInfo()
  },
  mounted() {
    debugUtil.log('高度', this.pageHeight)
  },
  computed: {
    ...mapState(['memberList']),
  },
  methods: {
    ...mapActions(['getBaseInfo']),
    async viewappear() {
      this.getBaseInfo()
      const res = await this.$bridge.getAllBarHeight()
      if (!this.isIos) {
        this.statusBar = res.statusBar
      }
      this.bottomArc = res.bottomArc
    },
    go2Edit(item) {
      this.$bridge.push({
        url: 'userEdit.js',
      })
      setTimeout(() => {
        userEditChannel.postMessage({ user: item })
      }, 1000)
    },
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
      debugUtil.log(e.contentOffset.y < 200)
    },
    go2Add() {
      this.$bridge.push({
        url: 'userAdd.js',
      })
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
  width: 500px;
  white-space: nowrap;
  text-overflow: ellipsis;
  lines: 1;
  overflow: hidden;
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
