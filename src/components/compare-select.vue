<script setup>
import { CMP_ORD } from '@/constants';

const options = [{
  value: CMP_ORD.EQ,
  label: '等于',
}, {
  value: CMP_ORD.GT,
  label: '大于',
}, {
  value: CMP_ORD.LT,
  label: '小于',
}, {
  value: CMP_ORD.BT,
  label: '之间',
}];
</script>
<template>
  <ASelect
    style="width: 70px"
    :options="options"
  />
</template>
<style scoped>
</style>
