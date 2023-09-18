<template>
  <div style="align-items: center; margin-top: 90px">
    <scroller>
      <view style="padding: 20px; background-color: burlywood">
        <text style="font-size: 22px">{{ receiveMessageData }}</text>
      </view>
      <view style="padding: 20px; background-color: antiquewhite">
        <text>{{ JSON.stringify(versionInfo) }}</text>
        <dof-button
          type="primary"
          text="查询版本信息"
          size="full"
          @dofButtonClicked="click2QueryDeviceVersionInfo"
        ></dof-button>
      </view>
      <view style="padding: 20px; background-color: aliceblue">
        <text>{{ JSON.stringify(userInfoMark) }}</text>
        <dof-button
          type="primary"
          text="用户信息查询"
          size="full"
          @dofButtonClicked="click2QueryUserInfoMark"
        ></dof-button>
      </view>
      <view style="padding: 20px; background-color: aqua">
        <text>{{ JSON.stringify(resetRes) }}</text>
        <dof-button
          type="primary"
          text="恢复出厂设置"
          size="full"
          @dofButtonClicked="click2ResetFactory"
        ></dof-button>
      </view>
      <view style="padding: 20px; background-color: aquamarine">
        <text>{{ JSON.stringify(batteryRes) }}</text>
        <dof-button
          type="primary"
          text="电量查询"
          size="full"
          @dofButtonClicked="click2BatteryLevelMark"
        ></dof-button>
      </view>
      <view style="padding: 20px; background-color: blue">
        <text>{{ JSON.stringify(snRes) }}</text>
        <dof-button
          type="primary"
          text="查询设备SN"
          size="full"
          @dofButtonClicked="click2QueryDeviceSnMark"
        ></dof-button>
      </view>
      <view style="padding: 20px; background-color: blueviolet">
        <text>{{ JSON.stringify(historyRes) }}</text>
        <dof-button
          type="primary"
          text="同步历史数据"
          size="full"
          @dofButtonClicked="click2QuerySynchronization"
        ></dof-button>
      </view>
      <view style="padding: 20px; background-color: brown">
        <text>{{ JSON.stringify(addUserRes) }}</text>
        <dof-button
          type="primary"
          text="新增用户PIN"
          size="full"
          @dofButtonClicked="click2AddUserPIN"
        ></dof-button>
      </view>
      <view style="width: 100%; height: 100px"></view>
    </scroller>
  </div>
</template>

<script>
import pageBase from '../../mixins/pageBase'
import { mapActions } from 'vuex'
import debugUtil from '../../util/debugUtil'
import { DofButton } from 'dolphin-weex-ui'

const globalEvent = weex.requireModule('globalEvent')

export default {
  data: () => ({
    versionInfo: '',
    userInfoMark: '',
    resetRes: '',
    batteryRes: '',
    snRes: '',
    historyRes: '',
    addUserRes: '',
    receiveMessageData: '',
  }),
  created() {
    globalEvent.addEventListener('receiveMessage', data => {
      this.receiveMessageData = data
    })
  },
  mixins: [pageBase],
  components: {
    DofButton,
  },
  methods: {
    ...mapActions([
      'queryDeviceVersionInfo',
      'queryUserInfoMark',
      'resetFactory',
      'batteryLevelMark',
      'queryDeviceSnMark',
      'querySynchronization',
      'addUserPIN',
    ]),
    async click2QueryDeviceVersionInfo() {
      const res = await this.queryDeviceVersionInfo()
      this.versionInfo = res
      debugUtil.log('查询版本信息', res)
    },
    async click2QueryUserInfoMark() {
      const res = await this.queryUserInfoMark()
      this.userInfoMark = res
      debugUtil.log('用户信息查询', res)
    },
    async click2ResetFactory() {
      const res = await this.resetFactory()
      this.resetRes = res
      debugUtil.log('恢复出厂设置', res)
    },
    async click2BatteryLevelMark() {
      const res = await this.batteryLevelMark()
      this.batteryRes = res
      debugUtil.log('电量查询', res)
    },
    async click2QueryDeviceSnMark() {
      const res = await this.queryDeviceSnMark()
      this.snRes = res
      debugUtil.log('查询设备SN', res)
    },
    async click2QuerySynchronization() {
      const res = await this.querySynchronization()
      this.historyRes = res
      debugUtil.log('历史数据', res)
    },
    async click2AddUserPIN() {
      const res = await this.addUserPIN()
      this.addUserRes = res
      debugUtil.log('新增用户', res)
    },
  },
}
</script>
