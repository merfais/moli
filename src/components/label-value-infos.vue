<script setup>
import LabelValueInfo from './label-value-info';

defineProps({
  dataSource: Array,
});
</script>
<template>
  <LabelValueInfo v-for="(item, index) in dataSource"
    :key="item.key || index"
    v-bind="item"
  />
</template>
<style scoped>
</style>
