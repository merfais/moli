<script setup>
import {
  computed,
} from 'vue';
import {
  map,
} from 'lodash-es';
import { Form } from 'ant-design-vue';
import {
  INIT_VAL_TYPE,
  INIT_VAL_TYPE_NAME,
} from '@/constants';
import {
  COMP_KEY,
} from '../constants';
import SingleSelect from '../single-select';
import MultiSelect from '../multi-select';

const formItemContext = Form.useInjectFormItemContext();

const props = defineProps({
  compKey: String,
  value: {},
  initValType: String,
  firstN: Number,
  depDSs: Object,
  labelField: String,
  valueField: String,
});

const emit = defineEmits([
  'update:value',
  'updateInitValType',
]);

const optsMap = {
  [COMP_KEY.SINGLE_SELECT]: map([
    INIT_VAL_TYPE.STATIC,
    INIT_VAL_TYPE.FIRST,
  ], value => ({ label: INIT_VAL_TYPE_NAME[value], value })),
  [COMP_KEY.MULTI_SELECT]: map([
    INIT_VAL_TYPE.STATIC,
    INIT_VAL_TYPE.FIRST_N,
    INIT_VAL_TYPE.ALL,
  ], value => ({ label: INIT_VAL_TYPE_NAME[value], value })),
};
const staticIsMap = {
  [COMP_KEY.SINGLE_SELECT]: SingleSelect,
  [COMP_KEY.MULTI_SELECT]: MultiSelect,
};

const options = computed(() => optsMap[props.compKey]);
const staticIs = computed(() => staticIsMap[props.compKey]);

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
      <component :is="staticIs"
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
