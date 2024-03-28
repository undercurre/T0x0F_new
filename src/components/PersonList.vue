<template>
  <div>
    <div class="bar" ref="memBar" @click="onBarClick">
      <image class="person" :src="avator"></image>
      <image class="arrow" :src="arrow"></image>

      <popover-tab
        ref="popover"
        :buttons="popButtons"
        :position="popoverPosition"
        :arrowPosition="popoverArrowPosition"
        :textStyle="popTextStyle"
        coverColor="rgba(0, 0, 0, 0)"
        @wxcPopoverButtonClicked="popoverButtonClicked"
      >
      </popover-tab>
    </div>
  </div>
</template>

<script>
import PopoverTab from './popoverTab.vue'
import personIcon from '../assets/image/person.png'
import add from '../assets/image/add.png'
import arrow from '../assets/image/arrow.png'
import addIcon from '../assets/image/add.png'
import debugUtil from '../util/debugUtil'
import { mapGetters, mapMutations, mapState } from 'vuex'

const domModule = weex.requireModule('dom')

export default {
  components: {
    PopoverTab,
  },
  props: {
    offSelector: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      add,
      personIcon,
      addIcon,
      arrow,
      selected: '',
      popButtons: [
        {
          icon: addIcon,
          text: '添加成员',
          key: 'ADD',
        },
      ],
      popoverPosition: { x: -10, y: 254 },
      popoverArrowPosition: { pos: 'top', x: -40 },
    }
  },
  created() {
    if (this.curMemberDetail) this.selected = this.curMemberDetail.scaleUserId
    this.updateView()
  },
  computed: {
    ...mapState(['memberList', 'curMember']),
    ...mapGetters(['curMemberDetail', 'curAdmin']),
    avator() {
      if (this.curMemberDetail) {
        return this.curMemberDetail.headImageUrl
          ? this.curMemberDetail.headImageUrl
          : this.personIcon
      } else {
        return this.personIcon
      }
    },
    popTextStyle() {
      return {
        'font-family': 'PingFangSC-Regular',
        'font-size': '28px',
        color: '#FFFFFF',
        'font-weight': 400,
      }
    },
  },
  methods: {
    ...mapMutations(['setCurMember']),
    go2Add() {
      this.$bridge.push({
        url: 'userList.js',
      })
    },
    onBarClick() {
      domModule.getComponentRect(this.$refs['memBar'], res => {
        this.popoverPosition.y = res.size.top + 60
        this.$refs['popover'].wxcPopoverShow()
        this.updateView()
      })
    },
    chooseMember(personId) {
      this.selected = personId
      this.$storage.setStorage(`${this.curAdmin.userId}_selected`, personId)
      this.setCurMember(personId)
      this.$emit('offBack', !this.offSelector)
    },
    toggleSelector() {
      this.$emit('offBack', !this.offSelector)
    },
    popoverButtonClicked(e) {
      if (e.key === 'ADD') {
        this.go2Add()
      } else {
        debugUtil.log('选择', e)
        this.chooseMember(e.key)
      }
    },
    updateView() {
      let result = []
      for (let i = 0; i < this.memberList.length; i++) {
        result.push({
          icon: this.memberList[i].headImageUrl || this.personIcon,
          text: this.memberList[i].username,
          key: `${this.memberList[i].scaleUserId}`,
        })
      }
      result.push({
        icon: addIcon,
        text: '添加成员',
        key: 'ADD',
      })
      this.popButtons = result
      if (this.$refs['popover'])
        this.$refs['popover'].setCurIndex(this.selected)
    },
  },
  watch: {
    curMemberDetail() {
      if (this.curMemberDetail) this.selected = this.curMemberDetail.scaleUserId
      this.updateView()
    },
  },
}
</script>

<style scoped>
.bar {
  width: 104px;
  height: 56px;
  border-radius: 28px;
  background-color: #b1b8c0;
}
.person {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  position: absolute;
  left: 4px;
  top: 4px;
}
.arrow {
  width: 20px;
  height: 12px;
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
