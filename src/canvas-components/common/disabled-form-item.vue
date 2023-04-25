<script setup>
import {
  shallowRef,
  computed,
} from 'vue';
import { Form } from 'ant-design-vue';
import { getEditorDSOpts } from '@/stores/ds-pool';

const formItemContext = Form.useInjectFormItemContext();

const props = defineProps({
  exportDSs: Array,
});

const emit = defineEmits([
  'update:value',
]);

const trueValue = shallowRef();
const options = computed(() => {
  const list = getEditorDSOpts(props.exportDSs);
  return list;
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
      @update:value="onUpdateValue"
    >
      <ARadio value="">不禁用</ARadio>
      <ARadio class="mr-0"
        :value="trueValue"
      >
        当数据源
      </ARadio>
    </ARadioGroup>
    <RSelect class="var-selector mr-10"
      v-model:value="trueValue"
      :options="options"
      placeholder="请选择数据源"
    />
    的值为真时禁用
  </div>
</template>
<style scoped>
.var-selector {
  width: 200px;
}
</style>
