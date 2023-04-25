<script setup>
import {
  shallowRef,
  watch,
} from 'vue';
import { Form } from 'ant-design-vue';
import {
  getEditorDSValue,
} from '@/stores/ds-pool';


const formItemContext = Form.useInjectFormItemContext();

const props = defineProps({
  value: {},
  initVal: String,
  depDSs: Object,
});

const emit = defineEmits([
  'update:value',
  'updateInitVal',
]);

const options = [
  { label: '使用静态值', value: 'static' },
  { label: '选中第一个', value: 'first' },
];

const valueOptions = shallowRef([]);

watch(() => props?.depDSs?.options, () => {
  if (!props?.depDSs?.options) {
    valueOptions.value = [];
    return;
  }
  const dsValue = getEditorDSValue(props.depDSs.options);
  valueOptions.value = dsValue;
});

function onUpdateValue(value) {
  onUpdate(value);
}

function onUpdateInitVal(value) {
  emit('updateInitVal', value);
  onUpdate();
}

function onUpdate(value) {
  emit('update:value', value);
  formItemContext.onFieldChange();
}

</script>
<template>
  <div class="d-flex">
    <div class="init-val-wrapper">
      <RadioGroup
        :value="initVal"
        :options="options"
        @update:value="onUpdateInitVal"
      />
    </div>
    <div class="flex-grow">
      <RSelect
        :value="value"
        :options="valueOptions"
        :disabled="initVal !== 'static'"
        placeholder="请选择默认值"
        @update:value="onUpdateValue"
      />
    </div>
  </div>
</template>
<style scoped>
.init-val-wrapper {
  width: 110px;

  :deep(.ant-radio-wrapper) {
    &:first-child {
      height: 30px;
      padding-top: 5px;
      margin-bottom: 10px;
    }
    margin: 0;
  }
}
</style>
