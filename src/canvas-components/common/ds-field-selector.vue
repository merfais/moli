<script setup>
import {
  map,
} from 'lodash-es';
import {
  computed,
} from 'vue';
import {
  getEditorDSValue,
} from '@/stores/ds-pool';

const props = defineProps({
  depDSs: Object,
});

const options = computed(() => {
  if (!props.depDSs?.options) {
    return [];
  }
  const value = getEditorDSValue(props.depDSs.options);
  const list = Object.keys(value?.[0] || {});
  return map(list, value => ({ value, label: value }));
});
</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <div class="align-center">
    <div class="flex-0-0 mr-5">数据的</div>
    <RAutoComplete :options="options" v-bind="$attrs" />
    <div class="flex-0-0 ml-5">字段</div>
  </div>
</template>
<style scoped>
</style>
