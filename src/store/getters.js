// eslint-disable-next-line no-unused-vars
import debugUtil from '../util/debugUtil'

export default {
  isDeviceInfoInit(state) {
    return Object.keys(state.deviceInfo).length !== 0
  },
  isDeviceDetailInit(state) {
    return Object.keys(state.deviceDetail).length !== 0
  },
  isOnline(state) {
    return state.deviceInfo.isOnline && state.deviceInfo.isOnline === '1'
  },
  homeId(state) {
    return state.homeInfo.homeId
  },
  title(state) {
    return state.deviceInfo.deviceName || ''
  },
  curAdmin(state) {
    const curAdmin = state.memberList.find(item => {
      return item.isDefault === '1' && item.userId === state.userInfo.uid
    })
    return curAdmin
      ? curAdmin
      : {
          userId: state.userInfo.userId,
        }
  },
  curMemberDetail(state) {
    const curMember = state.memberList.find(item => {
      return item.scaleUserId === state.curMember
    })
    debugUtil.log('getter-curMemberDetail', curMember)
    const curAdmin = state.memberList.find(item => {
      return item.isDefault === '1' && item.userId === state.userInfo.uid
    })
    debugUtil.log('getter-curMemberDetail-Admin', curAdmin)
    // TODO: 假的头像
    if (curMember) {
      var today = new Date()
      var birthDate = new Date(curMember.birthday)
      curMember.age = today.getFullYear() - birthDate.getFullYear()
      var monthDiff = today.getMonth() - birthDate.getMonth()
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        curMember.age--
      }
    } else {
      if (curAdmin) {
        var todayA = new Date()
        var birthDateA = new Date(curAdmin.birthday)
        curAdmin.age = todayA.getFullYear() - birthDateA.getFullYear()
        var monthDiffA = todayA.getMonth() - birthDateA.getMonth()
        if (
          monthDiffA < 0 ||
          (monthDiffA === 0 && todayA.getDate() < birthDateA.getDate())
        ) {
          curAdmin.age--
        }
      }
    }
    return curMember ? curMember : curAdmin
  },
  newestRecord(state) {
    if (state.recordList.length > 0) {
      return state.recordList[0]
    } else {
      return {
        weight: null,
        createTimeStr: null,
      }
    }
  },
  lastRecord(state) {
    if (state.recordList.length > 1) {
      return state.recordList[1]
    } else {
      return {
        weight: null,
        createTimeStr: null,
      }
    }
  },
}
