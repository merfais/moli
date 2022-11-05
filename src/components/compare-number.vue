<script setup>
import { computed } from 'vue';
import { get, pick } from 'lodash-es';
import { Form } from 'ant-design-vue';
import { CMP_ORD } from '@/constants';
import CompareSelect from './compare-select';

const emit = defineEmits([
  'update:value',
]);
const props = defineProps({
  value: {
    type: Object,
    default: () => ({
      op: CMP_ORD.EQ,
      min: undefined,
      max: undefined,
      num: undefined,
    }),
  },
  opDisabled: Boolean,
});

const compareOp = computed(() => get(props.value, 'op'));
const minVal = computed(() => get(props.value, 'min'));
const maxVal = computed(() => get(props.value, 'max'));
const numVal = computed(() => get(props.value, 'num'));

const formItemContext = Form.useInjectFormItemContext();

const onUpdate = (value) => {
  emit('update:value', value);
  formItemContext.onFieldChange();
};

const onChangeType = (type) => {
  const payload = {
    op: type,
  };
  if (type === CMP_ORD.BT) {
    payload.max = maxVal.value;
    payload.min = minVal.value;
  } else {
    payload.num = numVal.value;
  }
  onUpdate(payload);
};

const onUpdateMinVal = (value) => {
  onUpdate({
    ...pick(props.value, ['op', 'max']),
    min: value,
  });
};

const onUpdateMaxVal = (value) => {
  onUpdate({
    ...pick(props.value, ['op', 'min']),
    max: value,
  });
};

const onUpdateVal = (value) => {
  onUpdate({
    op: props.value.op,
    num: value,
  });
};
</script>
<script>
export default {
  inheritAttrs: false,
};
</script>
<template>
  <AInputGroup compact class='compare-number'>
    <CompareSelect
      :value="compareOp"
      :disabled="$attrs.disabled || opDisabled"
      @change="onChangeType"
    />
    <template v-if="compareOp === CMP_ORD.BT">
      <AInputNumber
        class='number-input'
        v-bind="$attrs"
        :value="minVal"
        placeholder="最小值"
        @update:value="onUpdateMinVal"
      />
      <span class="split-char">~</span>
      <AInputNumber
        class='number-input'
        v-bind="$attrs"
        :value="maxVal"
        placeholder="最大值"
        @update:value="onUpdateMaxVal"
      />
    </template>
    <AInputNumber
      v-else
      class='number-input'
      v-bind="$attrs"
      :value="numVal"
      @update:value="onUpdateVal"
    />
  </AInputGroup>
</template>
<style scoped>
.compare-number {
  display: flex;

  .split-char {
    line-height:30px;
    padding:0px 20px;
    color:#999;
    border-top:1px solid #ccc;
    border-bottom:1px solid #ccc;
  }
  .number-input {
    flex-grow: 1;
  }
}
</style>

