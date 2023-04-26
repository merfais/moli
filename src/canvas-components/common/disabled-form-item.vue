<script setup>
import {
  computed,
} from 'vue';
import { Form } from 'ant-design-vue';
import { getEditorDSOpts } from '@/stores/ds-pool';

const formItemContext = Form.useInjectFormItemContext();

const props = defineProps({
  exportDSs: Array,
  value: String,
});

const emit = defineEmits([
  'update:value',
]);

const options = computed(() => {
  const list = getEditorDSOpts(props.exportDSs);
  return list;
});

const trueValue = computed(() => {
  if (!props.value) {
    return;
  }
  return props.value;
});

function onUpdateValue(value) {
  emit('update:value', value);
  formItemContext.onFieldChange();
}

</script>
<script>
export default { inheritAttrs: false };
</script>
<template>
  <div class="align-center">
    <ARadioGroup
      v-bind="$attrs"
      :value="value"
      @update:value="onUpdateValue"
    >
      <ARadio value="">不禁用</ARadio>
      <ARadio class="mr-0"
        :value="trueValue"
      >
        当数据源
      </ARadio>
    </ARadioGroup>
    <RSelect class="ds-selector mr-10"
      :value="trueValue"
      :options="options"
      :disabled="value === ''"
      placeholder="请选择数据源"
      @update:value="onUpdateValue"
    />
    的值为真时禁用
  </div>
</template>
<style scoped>
.ds-selector {
  width: 200px;
}
</style>
