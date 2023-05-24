<script setup>
import { Form } from 'ant-design-vue';
import {
  INIT_VAL_TYPE,
  INIT_VAL_TYPE_NAME,
} from '@/constants';
import SingleSelect from './index';

const formItemContext = Form.useInjectFormItemContext();

defineProps({
  value: {},
  initValType: String,
  depDSs: Object,
  labelField: String,
  valueField: String,
});

const emit = defineEmits([
  'update:value',
  'updateInitValType',
]);

const options = [
  INIT_VAL_TYPE.STATIC,
  INIT_VAL_TYPE.FIRST,
].map(value => ({ label: INIT_VAL_TYPE_NAME[value], value }));

function onUpdateValue(value) {
  updateValue(value);
}

function onUpdateInitVal(value) {
  emit('updateInitValType', value);
}

function updateValue(value) {
  emit('update:value', value);
  formItemContext.onFieldChange();
}

</script>
<template>
  <div class="d-flex">
    <div class="init-val-wrapper">
      <RadioGroup
        :value="initValType"
        :options="options"
        @update:value="onUpdateInitVal"
      />
    </div>
    <div class="flex-grow">
      <SingleSelect
        :value="value"
        :disabled="initValType !== INIT_VAL_TYPE.STATIC"
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
