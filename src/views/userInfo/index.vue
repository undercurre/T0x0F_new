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
          <gender
            v-if="step === 1"
            @getGender="getGender"
            :gender="gend"
          ></gender>
          <birthday
            v-if="step === 2"
            @getBirth="getBirth"
            :date="birth"
          ></birthday>
          <height
            v-if="step === 3"
            @getHeight="getHeight"
            :height="heig"
          ></height>
        </div>
        <div class="footer">
          <div class="explain_box">
            <text class="explain">说明:</text>
            <text class="explain"
              >您的个人基本信息将用于健康数据采集、健康状况评估、个性化健康方案制定等，您的所有信息我们将严格保密。
            </text>
          </div>

          <dof-button
            :text="step === 3 ? '完成' : '下一步'"
            type="primary"
            size="full"
            @dofButtonClicked="nextInfo"
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
        <text class="title_text">个人信息</text>
      </div>
    </dof-minibar>
    <dof-modal
      title="用户须知"
      content="本产品为家庭用产品，测量数据作为使用者塑身、体型参数参考，不作为医疗用途，不得用于医院、诊所等医疗、卫生、防疫等相关医疗机构。"
      :show="show_know"
      @dofModalConfirmBtnClicked="show_know = false"
      :single="true"
    >
    </dof-modal>
  </div>
</template>
<script>
import { DofMinibar, DofModal, DofButton } from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import gender from '../../components/gender.vue'
import height from '../../components/height.vue'
import birthday from '../../components/birthday.vue'
import { mapActions, mapGetters } from 'vuex'
import debugUtil from '../../util/debugUtil'

export default {
  components: {
    DofMinibar,
    DofModal,
    gender,
    height,
    birthday,
    DofButton,
  },
  mixins: [pageBase],
  data: () => ({
    scrollY: 0,
    //TODO: 解释型号是什么型号的什么设备在配网
    leftButton,
    gend: '',
    heig: 170,
    birth: '2000-01-01',
    step: 1,
    show_know: false,
  }),
  async created() {},
  async mounted() {
    await this.getBaseInfo()
    // 什么信息都没有证明首次使用
    debugUtil.log('个人信息', this.curAdmin)
    if (
      this.curAdmin &&
      !this.curAdmin.sex &&
      !this.curAdmin.height &&
      !this.curAdmin.birthday
    ) {
      this.show_know = true
    } else {
      if (this.curAdmin.sex) this.gend = this.curAdmin.sex
      if (this.curAdmin.height) this.heig = this.curAdmin.height
      if (this.curAdmin.birthday) this.birth = this.curAdmin.birthday
    }
    debugUtil.log(this.gend, this.heig, this.birth)
  },
  computed: {
    ...mapGetters(['curAdmin']),
  },
  methods: {
    ...mapActions([
      'init',
      'getBaseInfo',
      'initScaleUser',
      'queryScaleUserList',
      'uptScaleUser',
    ]),
    back() {
      // todo: 返回时可以加入空提示
    },
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
    },
    async nextInfo() {
      debugUtil.log('修改前', this.curAdmin)
      if (this.step === 3) {
        // 修改人物属性
        const userInfo = {
          scaleUserId: this.curAdmin.scaleUserId,
          username: this.curAdmin.username,
          height: this.heig,
          sex: this.gend,
          birthday: this.birth,
        }

        const res = await this.uptScaleUser(userInfo)
        debugUtil.log('修改结果', res)

        // tode: 跳到首页
        if (res.isSuccess) {
          this.$bridge.pop()
        }
      } else {
        if (this.gend !== '0' && this.gend !== '1') {
          this.$toast('请选择性别')
          return
        }
      }
      this.step += 1
    },
    getGender(e) {
      this.gend = e
      debugUtil.log('性别选择', this.gend)
    },
    getBirth(e) {
      this.birth = e
    },
    getHeight(e) {
      this.heig = e
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
.info_list {
  padding-top: 190px;
  width: 750px;
  justify-content: flex-start;
}
.search {
  align-items: center;
}
.button {
  width: 120px;
  height: 64px;
  border-radius: 32px;
}
.footer {
  align-items: center;
}
.explain_box {
  padding-left: 48px;
  padding-right: 48px;
}
.explain {
  font-size: 24px;
  color: #8a8a8f;
  letter-spacing: 0;
  line-height: 36px;
  font-weight: 400;
  margin-bottom: 24px;
}
</style>
