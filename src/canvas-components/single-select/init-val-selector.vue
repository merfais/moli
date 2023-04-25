<script setup>
import { Form } from 'ant-design-vue';
import SingleSelect from './index';

const formItemContext = Form.useInjectFormItemContext();

defineProps({
  value: {},
  initVal: String,
  depDSs: Object,
  labelField: String,
  valueField: String,
});

const emit = defineEmits([
  'update:value',
  'updateInitVal',
]);

const options = [
  { label: '使用静态值', value: 'static' },
  { label: '选中第一个', value: 'first' },
];

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
      <SingleSelect
        :value="value"
        :disabled="initVal !== 'static'"
        :depDSs="depDSs"
        :labelField="labelField"
        :valueField="valueField"
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
