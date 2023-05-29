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
  'updateFirstN',
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

function onUpdateInitVal(value) {
  emit('updateInitValType', value);
  formItemContext.onFieldChange();
}

function onUpdateValue(value) {
  emit('update:value', value);
  formItemContext.onFieldChange();
}

function onUpdateFirstN(n) {
  emit('updateFirstN', n);
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
        class="mb-5"
        :value="value"
        :disabled="initValType !== INIT_VAL_TYPE.STATIC"
        :depDSs="depDSs"
        :initValType="INIT_VAL_TYPE.STATIC"
        :labelField="labelField"
        :valueField="valueField"
        placeholder="请选择默认值"
        withoutAllOption
        @update:value="onUpdateValue"
      />
      <AInputNumber v-if="compKey === COMP_KEY.MULTI_SELECT"
        class="first-n"
        :value="firstN"
        :min="1"
        addonAfter="个"
        :disabled="initValType !== INIT_VAL_TYPE.FIRST_N"
        @update:value="onUpdateFirstN"
      />
    </div>
  </div>
</template>
<style scoped>
.init-val-wrapper {
  width: 105px;

  :deep(.ant-radio-wrapper) {
    padding-top: 6px;
    height: 30px;
    margin-right: 0;
    margin-bottom: 5px;

    &:last-child {
      margin: 0;
    }

    > span + span {
      padding-right: 5px;
    }
  }
}

.first-n {
  transform: translateX(-30px);
}
</style>
