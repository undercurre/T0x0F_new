<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div
    class="container"
    :style="{
      height:
        96 * (memberList.length + 1) > 426
          ? 426
          : 96 * (memberList.length + 1) + 76 + 'px',
    }"
  >
    <div class="toggle" @click="toggleSelector">
      <image
        class="icon"
        :src="avator"
        style="width: 48px; height: 48px; border-radius: 24px"
      ></image>
      <image class="icon" :src="arrow" style="width: 16px; height: 8px"></image>
    </div>
    <div class="san_wrap" v-if="offSelector">
      <div class="san"></div>
    </div>
    <div class="dropdown-container" v-if="offSelector">
      <scroller
        :style="{
          height:
            96 * (memberList.length + 1) > 350
              ? 350
              : 96 * (memberList.length + 1) + 'px',
        }"
        show-scrollbar="false"
      >
        <div v-for="(item, index) in memberList" :key="item">
          <div @click="chooseMember(item)">
            <PersonItem
              class="item"
              :name="item.username"
              :status="item.scaleUserId === selected"
              :icon="item.headImageUrl"
            ></PersonItem>
          </div>
          <div class="line" v-if="index !== memberList.length - 1"></div>
        </div>
        <div class="line"></div>
        <div class="item" @click="go2Add">
          <image
            class="icon"
            :src="add"
            style="width: 48px; height: 48px"
          ></image>
          <text class="text">添加成员</text>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import PersonItem from './PersonItem.vue'
import personIcon from '../assets/image/person.png'
import add from '../assets/image/add.png'
import arrow from '../assets/image/arrow.png'
import debugUtil from '../util/debugUtil'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  components: {
    PersonItem,
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
      arrow,
      selected: '',
    }
  },
  created() {
    if (this.curMemberDetail) this.selected = this.curMemberDetail.scaleUserId
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
  },
  methods: {
    ...mapMutations(['setCurMember']),
    go2Add() {
      this.$bridge.push({
        url: 'userList.js',
      })
    },
    chooseMember(person) {
      debugUtil.log('列表选择', person)
      this.selected = person.scaleUserId
      this.$storage.setStorage(
        `${this.curAdmin.userId}_selected`,
        person.scaleUserId
      )
      this.setCurMember(person.scaleUserId)
      this.$emit('offBack', !this.offSelector)
    },
    toggleSelector() {
      this.$emit('offBack', !this.offSelector)
    },
  },
  watch: {
    curMemberDetail() {
      if (this.curMemberDetail) this.selected = this.curMemberDetail.scaleUserId
    },
  },
}
</script>

<style scoped>
.container {
  width: 256px;
  align-items: flex-end;
}
.san_wrap {
  height: 20px;
  width: 30px;
  position: absolute;
  top: 58px;
  right: 20px;
  overflow: hidden;
}
.san {
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.72);
  transform: rotate(45deg);
  position: absolute;
  right: 0px;
  top: 14px;
}
.toggle {
  width: 104px;
  height: 56px;
  background-color: #b1b8c0;
  border-radius: 28px;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  margin-bottom: 20px;
}

.icon {
  margin-right: 16px;
}
.dropdown-container {
  position: absolute;
  top: 76px;
  left: 0;
  width: 256px;
  background-color: rgba(0, 0, 0, 0.72);
  box-shadow: 0px 8px 26px 0px rgba(0, 0, 0, 0.33);
  padding-left: 28px;
  padding-right: 28px;
  box-sizing: border-box;
  border-radius: 16px;
}

.item {
  width: 200px;
  height: 96px;
  padding-top: 24px;
  padding-bottom: 24px;
  box-sizing: border-box;
  flex-direction: row;
  align-items: center;
}

.line {
  height: 1px;
  background-color: #fff;
  opacity: 0.3;
}

.text {
  margin-left: 24px;
  font-size: 28px;
  color: #ffffff;
  font-weight: 400;
}
</style>
