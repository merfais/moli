<script setup>
import {
  forEach,
} from 'lodash-es';
import { computed } from 'vue';
import {
  getEditorDSOpts,
  getEditorDSValue,
} from '@/stores/ds-pool';

const props = defineProps({
  exportDSs: Array,
});

const options = computed(() => {
  const list = getEditorDSOpts(props.exportDSs);
  const arr = [];
  const disabledArr = [];
  forEach(list, item => {
    const { value, label } = item;
    const dsValue = getEditorDSValue(value);
    const disabled = !Array.isArray(dsValue);
    const title = disabled
      ? `${value}，数据源的值是非数组时不可用`
      : value;
    if (disabled) {
      disabledArr.push({ value, label, title, disabled });
    } else {
      arr.push({ value, label, title });
    }
  });
  return [...arr, ...disabledArr];
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
