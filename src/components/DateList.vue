<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <div class="container">
    <DofCard class="card" :collapsable="true" :collapsed="collapsed">
      <text class="text">{{ selected }}</text>
      <div slot="body">
        <dof-card-item>
          <text class="text" @click="choose('week')">近一周</text>
        </dof-card-item>
        <dof-card-item>
          <text class="text" @click="choose('month')">近一月</text>
        </dof-card-item>
        <dof-card-item>
          <text class="text" @click="choose('year')">近一年</text>
        </dof-card-item>
      </div>
    </DofCard>
  </div>
</template>

<script>
import { DofCard, DofCardItem } from 'dolphin-weex-ui'

export default {
  components: {
    DofCard,
    DofCardItem,
  },
  data() {
    return {
      selected: '近一周',
      showSelector: false,
      collapsed: true,
      rules: {
        week: '近一周',
        month: '近一月',
        year: '近一年',
      },
    }
  },
  methods: {
    choose(rule) {
      this.selected = this.rules[rule]
      this.$emit('getRule', rule)
    },
  },
}
</script>

<style scoped>
.card {
  background-color: #f9f9f9;
}
.text {
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  font-size: 32px;
  color: #666666;
  letter-spacing: 0;
  text-align: center;
  font-weight: 400;
}
</style>
