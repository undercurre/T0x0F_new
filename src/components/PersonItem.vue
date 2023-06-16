<template>
  <div class="container" @click="chooseBack">
    <image
      class="icon"
      :src="icon ? icon : personIcon"
      style="width: 48px; height: 48px; border-radius: 24px"
    ></image>
    <text
      class="text"
      :style="{
        fontWeight: status ? 900 : 400,
        color: status ? '#267AFF' : '#ffffff',
      }"
      >{{ name }}</text
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import personIcon from '../assets/image/person.png'

export default {
  props: {
    name: {
      type: String,
      default: 'XX',
    },
    status: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      personIcon,
    }
  },
  computed: {
    ...mapGetters(['curMemberDetail']),
  },
  methods: {},
}
</script>

<style scoped>
.container {
  width: 256px;
  height: 96px;
  flex-direction: row;
  align-items: center;
}

.text-container {
  width: 112px;
  overflow: hidden;
}
.text {
  width: 112px;
  margin-left: 24px;
  font-size: 28px;
  color: #ffffff;
  font-weight: 400;
  lines: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
