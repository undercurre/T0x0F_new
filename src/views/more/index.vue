<template>
  <div
    style="background-color: #f9f9f9"
    :is-immersion="true"
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
  >
    <scroller
      class="scroller"
      :style="{
        height: this.pageHeight + 'px',
      }"
      @scroll="getScrollY"
    >
      <div
        class="content"
        :style="{
          minHeight: this.pageHeight,
        }"
      >
        <dof-cell
          class="cell"
          title="目标体重"
          right-text=""
          :has-sub-bottom-border="true"
          :has-arrow="true"
          @dofCellClicked="go2Target"
        >
        </dof-cell>
        <dof-cell
          class="cell"
          title="我的信息"
          right-text=""
          :has-sub-bottom-border="true"
          :has-arrow="true"
          @dofCellClicked="go2userInfo"
        >
        </dof-cell>
        <dof-cell
          class="cell"
          title="成员信息"
          right-text=""
          :has-sub-bottom-border="true"
          :has-arrow="true"
          @dofCellClicked="go2userList"
        >
        </dof-cell>
        <div style="height: 16px"></div>
        <dof-cell
          class="cell"
          title="用户手册"
          right-text=""
          :has-sub-bottom-border="true"
          :has-arrow="true"
          @dofCellClicked="go2Help"
        >
        </dof-cell>
        <dof-cell
          class="cell"
          title="版本号"
          :right-text="version"
          :has-sub-bottom-border="false"
          :has-arrow="false"
        >
        </dof-cell>
      </div>
    </scroller>
    <dof-minibar
      class="minibar"
      :backgroundColor="scrollY < -100 ? '#fff' : 'transparent'"
      @dofMinibarLeftButtonClicked="minibarLeftButtonClick"
    >
      <div slot="left">
        <image
          :src="leftButton"
          style="height: 55px; width: 55px; transform: translateX(-10px)"
        ></image>
      </div>
      <div slot="middle">
        <text class="title_text">更多</text>
      </div>
    </dof-minibar>
  </div>
</template>

<script>
import { DofCell } from 'dolphin-weex-ui'
import leftButton from '../../assets/image/header/back_black@2x.png'
import base from '../../mixins/pageBase'
import superMoreUtil from '../../util/superMoreUtil'
import { mapActions, mapGetters } from 'vuex'
import { version } from '../../../package.json'
import debugUtil from '../../util/debugUtil'

const userEditChannel = new BroadcastChannel('userEdit')

export default {
  components: {
    DofCell,
  },
  mixins: [base],
  data() {
    return {
      leftButton,
      isKnowNewVersion: false,
      scrollY: 0,
      version,
    }
  },
  computed: {
    ...mapGetters(['curAdmin', 'curMemberDetail']),
  },
  methods: {
    ...mapActions(['getBaseInfo']),
    go2userInfo() {
      this.$bridge.push({
        url: 'userEdit.js',
      })
      setTimeout(() => {
        userEditChannel.postMessage({ user: this.curAdmin })
      }, 1000)
    },
    go2userList() {
      this.$bridge.push({
        url: 'userList.js',
      })
    },
    go2Target() {
      if (
        this.curMemberDetail &&
        (this.curMemberDetail.sex === undefined ||
          this.curMemberDetail.height === undefined ||
          this.curMemberDetail.birthday === undefined)
      ) {
        debugUtil.log(this.curMemberDetail)
        this.$bridge.showToast('请先录入个人信息')
      } else {
        this.$bridge.push({
          url: 'targetWeight.js',
        })
      }
    },
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
    },
    go2Help() {
      this.$bridge.push({
        url: 'help.js',
      })
    },
    viewappear() {
      this.getBaseInfo()
    },
  },
  async mounted() {
    superMoreUtil.adjustStyle(this.$refs.body)
  },
  created() {
    this.getBaseInfo()
  },
}
</script>

<style scoped>
.minibar {
  position: fixed;
  top: 0;
}
.scroller {
  width: 750px;
}
.title_text {
  font-weight: 900;
  font-size: 36px;
  line-height: 90px;
  color: #000;
}
.content {
  width: 750px;
  padding-top: 200px;
  align-items: center;
  overflow: hidden;
}

.cell {
  width: 750px;
}
</style>
