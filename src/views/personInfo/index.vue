<template>
  <div
    style="background-color: #f9f9f9"
    :is-immersion="true"
    @viewappear="viewappear"
    @viewdisappear="viewdisappear"
  >
    <scroller :style="{ height: this.pageHeight }" @scroll="getScrollY">
      <div class="content" :style="{ minHeight: this.pageHeight }">
        <div class="content_wrap">
          <div class="info_list">
            <dof-cell
              title="昵称"
              right-text="请输入"
              :has-sub-bottom-border="true"
              :has-arrow="true"
              @dofCellClicked="cellClickedHandler"
            >
            </dof-cell>
            <dof-cell
              title="性别"
              right-text="请选择"
              :has-sub-bottom-border="true"
              :has-arrow="true"
              @dofCellClicked="cellClickedHandler"
            >
            </dof-cell>
            <dof-cell
              title="身高"
              right-text="请选择"
              :has-sub-bottom-border="true"
              :has-arrow="true"
              @dofCellClicked="cellClickedHandler"
            >
            </dof-cell>
            <dof-cell
              title="出生日期"
              right-text="请选择"
              :has-sub-bottom-border="false"
              :has-arrow="true"
              @dofCellClicked="cellClickedHandler"
            >
            </dof-cell>
          </div>
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
        <text class="title_text">个人信息</text>
      </div>
    </dof-minibar>
  </div>
</template>
<script>
import { DofMinibar, DofCell } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import personIcon from '../../assets/image/person.png'
import editIcon from '../../assets/image/edit.png'

export default {
  components: {
    DofMinibar,
    DofCell,
  },
  mixins: [pageBase],
  data: () => ({
    scrollY: 0,
    leftButton,
    editIcon,
    personIcon,
  }),
  async created() {},
  mounted() {},
  computed: {},
  methods: {
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
      debugUtil.log(e.contentOffset.y < 200)
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
  background-color: #f9f9f9;
  padding-top: 240px;
  justify-content: space-between;
  align-items: center;
}

.content_wrap {
  align-items: center;
}

.avator {
  width: 160px;
  height: 160px;
  align-items: center;
  position: relative;
  margin-bottom: 60px;
}

.edit {
  position: absolute;
  right: 0;
  bottom: 0;
}

.info_list {
  width: 750px;
  justify-content: flex-start;
}
</style>
