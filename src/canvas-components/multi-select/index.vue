<script setup>
import {
  get,
  forEach,
  isEmpty,
  map,
} from 'lodash-es';
import {
  ref,
  unref,
  computed,
  shallowRef,
  watch,
  useAttrs,
} from 'vue';
import { useElementHover } from '@vueuse/core';
import {
  watchEditorDS,
  getEditorDSValue,
} from '@/stores/ds-pool';
import {
  INIT_VAL_TYPE,
} from '@/constants';
import {
  SELECT_COMP_TYPE,
  NOOP,
} from '../constants';

const props = defineProps({
  i: String,
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
  initValType: String,
  firstN: Number,
  withoutAllOption: Boolean,
});

const attrs = useAttrs();

const emit = defineEmits([
  'update:value',
  'update:ds',
]);

const watchMap = {
  unwatchOptions: NOOP,
  unwatchDisabled: NOOP,
  unwatchUpdateValue: NOOP,
};

const optionsDSValue = shallowRef([]);
const disabled = ref(false);
const allOptDomRef = ref();
const reverseOptDomRef = ref();
const allOptIsHovered = useElementHover(allOptDomRef);
const reverseOptIsHovered = useElementHover(reverseOptDomRef);

const allOptClass = computed(() => {
  return { 'ant-select-item-option-active': unref(allOptIsHovered) };
});

const reverseOptClass = computed(() => {
  return { 'ant-select-item-option-active': unref(reverseOptIsHovered) };
});

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
  watchMap.unwatchOptions();
  if (!props?.depDSs?.options) {
    optionsDSValue.value = [];
    return;
  }
  watchMap.unwatchOptions = watchEditorDS(props.depDSs.options, () => {
    optionsDSValue.value = getEditorDSValue(props.depDSs.options);
  }, { immediate: true });
}, { immediate: true });

watch(() => props?.depDSs?.disabled, () => {
  watchMap.unwatchDisabled();
  if (!props?.depDSs?.disabled) {
    disabled.value = false;
    return;
  }
  watchMap.unwatchDisabled = watchEditorDS(props.depDSs.disabled, () => {
    const value = getEditorDSValue(props.depDSs.disabled);
    if (typeof value === 'object') {
      disabled.value = !isEmpty(value);
    } else {
      disabled.value = !!value;
    }
  }, { immediate: true });
}, { immediate: true });

watch([
  () => props.initValType,
  () => props.firstN,
], () => setInitVal(), { immediate: true });

watchMap.unwatchUpdateValue = watch(() => unref(innerOptions), () => {
  setInitVal();
}, { immediate: true });

function setInitVal() {
  if (props.initValType === INIT_VAL_TYPE.STATIC) {
    return;
  }

  let arr = unref(innerOptions);
  if (props.initValType === INIT_VAL_TYPE.FIRST_N) {
    arr = arr.slice(0, props.firstN || 1);
  }
  const value = map(arr, item => get(item, props.valueField));
  updateValue(value);
}

function onUpdateValue(value) {
  watchMap.unwatchUpdateValue();
  updateValue(value);
}

function updateValue(value) {
  emit('update:value', value);
  emit('update:ds', {
    dsId: props.exportDS1,
    value,
  });
}

function onClickAllOpt() {
  const value = map(unref(innerOptions), item => get(item, props.valueField));
  if (value.length && value.length === attrs.value?.length) {
    updateValue([]);
  } else {
    updateValue(value);
  }
}

function onClickReverseOpt() {
  let value = map(unref(innerOptions), item => get(item, props.valueField));
  const oldVal = attrs.value || [];
  value = value.filter(v => oldVal.indexOf(v) === -1);
  updateValue(value);
}

function getPopupContainer() {
  return props.i
    ? document.querySelector(`#${props.i}_grid_item`)
    : document.body;
}

</script>
<template>
  <ButtonCheckboxGroup v-if="compType === SELECT_COMP_TYPE.BTN_CHECKBOX"
    :options="innerOptions"
    :disabled="disabled"
    @update:value="onUpdateValue"
  />
  <CheckboxGroup v-else-if="compType === SELECT_COMP_TYPE.CHECKBOX"
    :options="innerOptions"
    :disabled="disabled"
    @update:value="onUpdateValue"
  />
  <RSelect v-else
    class="width-100"
    mode="multiple"
    :placeholder="innerPlaceholder"
    :options="innerOptions"
    :disabled="disabled"
    :getPopupContainer="getPopupContainer"
    maxTagCount="responsive"
    @update:value="onUpdateValue"
  >
    <template #dropdownRender="{ menuNode }">
      <component :is="menuNode" />
      <ADivider style="margin: 4px 0" />
      <div v-if="withoutAllOption !== true"
        ref="allOptDomRef"
        class="ant-select-item ant-select-item-option"
        :class="allOptClass"
        @mousedown.prevent="() => {}"
        @click.stop="onClickAllOpt"
      >
        全选
      </div>
      <div ref="reverseOptDomRef"
        class="ant-select-item ant-select-item-option"
        :class="reverseOptClass"
        @mousedown.prevent="() => {}"
        @click.stop="onClickReverseOpt"
      >
        反选
      </div>
    </template>
  </RSelect>
</template>
<style scoped>
</style>
