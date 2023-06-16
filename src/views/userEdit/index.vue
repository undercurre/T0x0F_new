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
          <div class="avator" @click="showImageAction = true">
            <div class="avator_image">
              <image
                class="avator_image"
                :src="userInfo.imageBase64 ? userInfo.imageBase64 : personIcon"
              ></image>
            </div>
            <image
              class="edit"
              :src="editIcon"
              style="width: 52px; height: 52px"
            ></image>
          </div>

          <div class="info_list">
            <dof-cell
              title="昵称"
              :right-text="
                (userInfo.username.length > 5
                  ? userInfo.username.slice(0, 5) + '...'
                  : userInfo.username) || '请输入'
              "
              :has-sub-bottom-border="true"
              :has-arrow="true"
              @dofCellClicked="showNameInput = true"
            >
            </dof-cell>
            <dof-cell
              title="性别"
              :right-text="userInfo.sex ? sexStr : '请选择'"
              :has-sub-bottom-border="true"
              :has-arrow="true"
              @dofCellClicked="showSexAction = true"
            >
            </dof-cell>
            <dof-cell
              title="身高"
              :right-text="userInfo.height || '请选择'"
              :has-sub-bottom-border="true"
              :has-arrow="true"
              @dofCellClicked="showHeightAction = true"
            >
            </dof-cell>
            <dof-cell
              title="出生日期"
              :right-text="userInfo.birthday || '请选择'"
              :has-sub-bottom-border="false"
              :has-arrow="true"
              @dofCellClicked="pickDate"
            >
            </dof-cell>
          </div>
        </div>
        <DofButton
          class="button"
          type="primary"
          size="full"
          text="保存"
          @dofButtonClicked="save"
        ></DofButton>

        <dof-modal
          title="昵称"
          content="请输入昵称"
          :show="showNameInput"
          hasInput="true"
          :inputContent="userInfo.username"
          placeholder="请输入"
          confirmText="确认"
          @close="closeModal"
          @dofModalCancelBtnClicked="showNameInput = false"
          @dofModalConfirmBtnClicked="nameConfirmBtnClicked"
        >
        </dof-modal>

        <dof-popup
          :width="750"
          :height="600"
          :show="showSexAction"
          pos="bottom"
          ref="dofPopupSex"
          @dofPopupOverlayClicked="showSexAction = false"
          @dofPopupButtonClicked="showSexAction = false"
          :button="['确定']"
        >
          <gender
            :gender="userInfo.sex"
            class="genderPicker"
            @getGender="getGender"
          ></gender>
        </dof-popup>

        <dof-popup
          :width="750"
          :height="910"
          :show="showHeightAction"
          pos="bottom"
          ref="dofPopupHeight"
          @dofPopupOverlayClicked="showHeightAction = false"
          @dofPopupButtonClicked="showHeightAction = false"
          :button="['确定']"
        >
          <height
            :height="userInfo.height"
            class="genderPicker"
            @getHeight="getHeight"
          ></height>
        </dof-popup>

        <dof-actionsheet
          :show="showImageAction"
          :items="['拍照', '从相册中选择']"
          @dofPopupOverlayClicked="showImageAction = false"
          @dofItemClick="imageActionsheetClick"
          @dofCancelClick="showImageAction = false"
        >
        </dof-actionsheet>
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
        <text class="title_text">成员信息</text>
      </div>
      <div slot="right">
        <text
          v-if="userInfo.isDefault === '0'"
          class="deleteText"
          @click="deleteMember"
          >删除</text
        >
      </div>
    </dof-minibar>
  </div>
</template>
<script>
import {
  DofMinibar,
  DofButton,
  DofCell,
  DofModal,
  DofPopup,
  DofActionsheet,
} from 'dolphin-weex-ui'
import pageBase from '../../mixins/pageBase'
import leftButton from '../../assets/image/header/back_black@2x.png'
import personIcon from '../../assets/image/person.png'
import editIcon from '../../assets/image/edit.png'
import debugUtil from '../../util/debugUtil'
import gender from '../../components/gender.vue'
import height from '../../components/height.vue'
import { mapActions, mapState } from 'vuex'
import { formatDate3, getOneHundredYearsAgoDate } from '../../util/index'

const picker = weex.requireModule('picker')
const userEditChannel = new BroadcastChannel('userEdit')

export default {
  components: {
    DofMinibar,
    DofButton,
    DofCell,
    DofModal,
    DofPopup,
    DofActionsheet,
    gender,
    height,
  },
  mixins: [pageBase],
  data: () => ({
    scrollY: 0,
    leftButton,
    editIcon,
    personIcon,
    userInfo: {
      scaleUserId: '',
      username: '',
      height: 0,
      sex: '',
      birthday: '',
      headImageUrl: '',
      imageBase64: '',
    },
    showNameInput: false,
    showSexAction: false,
    showHeightAction: false,
    showImageAction: false,
  }),
  async created() {
    userEditChannel.onmessage = event => {
      debugUtil.log('消息总线收到消息', event.data)
      this.userInfo.scaleUserId = event.data.user.scaleUserId
      this.userInfo.username = event.data.user.username
      this.userInfo.height = event.data.user.height
      this.userInfo.sex = event.data.user.sex
      this.userInfo.birthday = event.data.user.birthday
      this.userInfo.headImageUrl = event.data.user.headImageUrl
      this.userInfo.imageBase64 = event.data.user.headImageUrl
      this.userInfo.isDefault = event.data.user.isDefault
    }
    await this.getBaseInfo()
  },
  mounted() {},
  computed: {
    ...mapState(['memberList']),
    sexStr() {
      if (this.userInfo.sex === '1') {
        return '女'
      } else if (this.userInfo.sex === '0') {
        return '男'
      } else {
        return '请选择'
      }
    },
  },
  methods: {
    ...mapActions([
      'uptScaleUser',
      'getBaseInfo',
      'uploadPicToOss',
      'batchDelScaleUser',
    ]),
    getScrollY(e) {
      this.scrollY = e.contentOffset.y
      debugUtil.log(e.contentOffset.y < 200)
    },
    nameConfirmBtnClicked(e) {
      const emojiRegex =
        /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\u200D/g
      if (emojiRegex.test(e.content)) {
        this.$toast('昵称不能包含表情包')
        return
      }
      this.userInfo.username = e.content
      this.showNameInput = false
    },
    sexConfirmBtnClicked(e) {
      this.userInfo.username = e.content
      this.showNameInput = false
    },
    pickDate() {
      const now = new Date()
      const nowStr = formatDate3(now)
      const hundredDate = getOneHundredYearsAgoDate()
      picker.pickDate(
        {
          value: this.userInfo.birthday || '2000-01-01',
          max: nowStr,
          min: hundredDate,
          headTitle: '选择日期', //标题
          cancelTxt: '取消', //取消按钮文字
          confirmTxt: '确定', //确定按钮文字,
          cancelTxtColor: '#000000', //取消颜色
          confirmTxtColor: '#000000', //标题颜色
          columnRatios: [3, 1, 2],
        },
        event => {
          var result = event.result
          if (result == 'success') {
            this.userInfo.birthday = event.data
          }
        }
      )
    },
    getGender(e) {
      debugUtil.log('性别选择成功', e)
      this.userInfo.sex = e
    },
    getHeight(e) {
      debugUtil.log('身高选择成功', typeof e)
      this.userInfo.height = e
      this.$set(this.userInfo, 'height', e)
    },
    addAvator() {},
    async save() {
      const userInfo = this.userInfo
      // 检测表情包
      const emojiRegex =
        /[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\u200D/g
      if (emojiRegex.test(userInfo.username)) {
        this.$toast('昵称不能包含表情包')
        return
      }
      if (
        !userInfo.username ||
        !userInfo.sex ||
        !userInfo.height ||
        !userInfo.birthday
      ) {
        if (!userInfo.username) this.$toast('请输入昵称')
        if (!userInfo.sex) this.$toast('请选择性别')
        if (!userInfo.height) this.$toast('请选择身高')
        if (!userInfo.birthday) this.$toast('请选择生日')
        return
      }
      const res = await this.uptScaleUser(this.userInfo)
      if (res.isSuccess) {
        debugUtil.log('修改成功', res)
        this.$bridge.pop()
      }
    },
    async deleteMember() {
      const paramsPartFail = {
        title: '是否确认删除该成员信息',
        args: [
          {
            confirmText: '取消',
            index: 10,
          },
          {
            confirmText: '确定',
            index: 11,
          },
        ],
      }
      this.$bridge.showConfirmView(paramsPartFail).then(async resConfirm => {
        if (resConfirm.confirmText === '确定') {
          const res = await this.batchDelScaleUser([this.userInfo.scaleUserId])
          debugUtil.log('删除结果', res)
          if (res.isSuccess) {
            debugUtil.log('删除成功', res)
            this.$bridge.pop()
          }
        }
      })
    },
    async imageActionsheetClick(e) {
      this.showImageAction = false
      const params = {
        compressRage: 60,
        type: 'jpg',
        isNeedBase64: true,
      }
      let res
      if (e.index == 0) {
        res = await this.$bridge.takePhoto(params)
      } else {
        res = await this.$bridge.choosePhoto(params)
      }
      debugUtil.log('获取到的图片', res.filePath)
      this.userInfo.imageBase64 = res.data
      const uploadRes = await this.uploadPicToOss(res.filePath)
      debugUtil.log('上传结果', uploadRes)
      this.userInfo.headImageUrl = uploadRes.files[0].path
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
  justify-content: space-between;
  align-items: center;
}

.avator {
  width: 160px;
  height: 160px;
  align-items: center;
  position: relative;
  margin-bottom: 60px;
}

.avator_image {
  width: 160px;
  height: 160px;
  border-radius: 80px;
  overflow: hidden;
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

.button {
  margin-top: 28px;
}

.genderPicker {
  margin-bottom: 20px;
}

.deleteText {
  font-size: 28px;
  color: #ff3b30;
  font-weight: 400;
}
</style>
