<script setup>
import {
  get,
  forEach,
} from 'lodash-es';
import {
  unref,
  computed,
  shallowRef,
  watch,
} from 'vue';
import {
  watchEditorDS,
  getEditorDSValue,
} from '@/stores/ds-pool';
import {
  SELECT_COMP_TYPE,
} from '../constants';

const props = defineProps({
  placeholder: String,
  label: String,
  exportDS1: String,
  labelField: {
    type: String,
    default: 'label',
  },
  valueField: {
    type: String,
    default: 'value',
  },
  compType: {
    type: String,
    default: 'select',
  },
  depDSs: Object,
});

const emit = defineEmits([
  'update:value',
  'update:ds',
]);

let unwatchOptionsDs;

const optionsDSValue = shallowRef([]);

const innerPlaceholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder;
  }
  const target = props.label || '数据';
  return `请选择${target}`;
});

const innerOptions = computed(() => {
  const list = [];
  const valueMap = {};
  forEach(unref(optionsDSValue), item => {
    const value = get(item, props.valueField);
    const label = get(item, props.labelField);
    if (!valueMap[value]) {
      valueMap[value] = true;
      list.push({ label, value, title: `${label}(${value})` });
    }
  });
  return list;
});

watch(() => props?.depDSs?.options, () => {
  if (!props?.depDSs?.options) {
    optionsDSValue.value = [];
    if (unwatchOptionsDs) {
      unwatchOptionsDs();
    }
    return;
  }
  unwatchOptionsDs = watchEditorDS(props.depDSs.options, () => {
    optionsDSValue.value = getEditorDSValue(props.depDSs.options);
  }, { immediate: true });
}, { immediate: true });

function onUpdateValue(value) {
  emit('update:value', value);
  emit('update:ds', {
    dsId: props.exportDS1,
    value,
  });
}

</script>
<template>
  <ButtonRadioGroup v-if="compType === SELECT_COMP_TYPE.BTN_RADIO"
    :options="innerOptions"
    @update:value="onUpdateValue"
  />
  <RadioGroup v-else-if="compType === SELECT_COMP_TYPE.RADIO"
    :options="innerOptions"
    @update:value="onUpdateValue"
  />
  <RSelect v-else
    class="width-100"
    :placeholder="innerPlaceholder"
    :options="innerOptions"
    @update:value="onUpdateValue"
  />
</template>
<style scoped>
</style>
