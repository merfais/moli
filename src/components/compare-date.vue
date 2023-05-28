<script setup>
import { computed, unref } from 'vue';
import { get } from 'lodash-es';
import { Form } from 'ant-design-vue';
import dayjs from 'dayjs';
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
      range: [],
      date: undefined,
    }),
  },
});

const compareOp = computed(() => unref(get(props.value, 'op')));
const rangeVal = computed(() => {
  let [start, end] = unref(get(props.value, 'range', [])) || [];
  if (!start || !end) {
    return [];
  }
  start = dayjs(start);
  end = dayjs(end);
  return [start, end];
});

const dateVal = computed(() => {
  const date = unref(get(props.value, 'date')) || '';
  if (date) {
    return dayjs(date);
  }
  return null;
});

const formItemContext = Form.useInjectFormItemContext();

const onUpdate = (value) => {
  emit('update:value', value);
  formItemContext.onFieldChange();
};

const onChangeOp = (type) => {
  const payload = {
    op: type,
  };
  if (type === CMP_ORD.BT) {
    payload.range = get(props.value, 'range') || [];
  } else {
    payload.date = get(props.value, 'date') || '';
  }
  onUpdate(payload);
};

const onChangeDate = (value) => {
  try {
    const date = value ? value.format('YYYY-MM-DD HH:mm') : '';
    onUpdate({
      op: props.value.op,
      date,
    });
  } catch (e) {
    console.error('更新时间出错', e);
  }
};

const onChangeRange = (value) => {
  try {
    let range = [];
    if (value && value.length === 2) {
      range = value.map(v => dayjs(v).format('YYYY-MM-DD HH:mm'));
    }
    onUpdate({
      op: props.value.op,
      range,
    });
  } catch (e) {
    console.error('更新时间范围出错', e);
  }
};
</script>
<script>
export default {
  inheritAttrs: false,
};
</script>
<template>
  <AInputGroup compact class='compare-date'>
    <CompareSelect
      :value="compareOp"
      :disabled="$attrs.disabled"
      @change="onChangeOp"
    />
    <RangePicker v-if="compareOp === CMP_ORD.BT"
      class='picker'
      v-bind="$attrs"
      :value="rangeVal"
      @update:value="onChangeRange"
    />
    <ADatePicker v-else
      class='picker'
      v-bind="$attrs"
      :show-time="{ format: 'HH:mm' }"
      :value="dateVal"
      format="YYYY-MM-DD HH:mm"
      @update:value="onChangeDate"
    />
  </AInputGroup>
</template>
<style scoped>
.compare-date {
  display: flex;

  .picker {
    flex-grow: 1;
  }

  :deep(.date-time-range-picker) {
    flex-grow: 1;
    display: flex;
  }
}
</style>
