<script setup>
import { map } from 'lodash-es';
import { computed } from 'vue';
import {
  getEditorDSList,
  getEditorDSValue,
} from '@/stores/ds-pool';

const props = defineProps({
  exportDSs: Array,
});

const options = computed(() => {
  const list = getEditorDSList(props.exportDSs);
  return map(list, item => {
    const { value, label } = item;
    const dsValue = getEditorDSValue(value);
    const disabled = !Array.isArray(dsValue);
    const title = disabled
      ? `${value}，数据源的值类型必须是数组`
      : value;
    return { value, label, title, disabled };
  });
});
</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <div class="align-center">
    <span class="flex-0-0 pr-5">使用数据源</span>
    <RSelect
      :options="options"
      v-bind="$attrs"
      placeholder="请选择数据源"
    />
    <span class="flex-0-0 pl-5">的值</span>
  </div>
</template>
<style scoped>
</style>
