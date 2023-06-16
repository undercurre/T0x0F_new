<template>
  <div class="container">
    <text class="search_text">请选择您的性别</text>
    <div class="gender">
      <div>
        <div
          class="gender_item"
          :style="{
            borderColor: gender === '0' ? '#267AFF' : '#F2F2F2',
          }"
          @click="choseGender('0')"
        >
          <image :src="male" style="width: 180px; height: 180px"></image>
        </div>
        <text class="gender_subtitle">男</text>
      </div>
      <div>
        <div
          class="gender_item"
          :style="{
            borderColor: gender === '1' ? '#267AFF' : '#F2F2F2',
          }"
          @click="choseGender('1')"
        >
          <image :src="female" style="width: 180px; height: 180px"></image>
        </div>
        <text class="gender_subtitle">女</text>
      </div>
    </div>
  </div>
</template>

<script>
import pageBase from '../mixins/pageBase'
import male from '../assets/image/male.png'
import female from '../assets/image/female.png'

export default {
  components: {},
  mixins: [pageBase],
  props: {
    gender: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    female,
    male,
  }),
  async created() {},
  mounted() {},
  computed: {},
  methods: {
    choseGender(genderItem) {
      this.$emit('getGender', genderItem)
    },
  },
}
</script>

<style>
.container {
  align-items: center;
}
.search_text {
  font-size: 40px;
  color: #232323;
  letter-spacing: 0;
  font-weight: 900;
  margin-top: 50px;
  margin-bottom: 86px;
}
.gender {
  flex-direction: row;
  width: 540px;
  justify-content: space-between;
}

.gender_item {
  width: 200px;
  height: 200px;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  border-width: 3px;
  border-style: solid;
  margin-bottom: 38px;
}
.gender_subtitle {
  font-size: 32px;
  color: #000000;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
}
</style>
