<script setup>
import {
  get,
  forEach,
  isEmpty,
} from 'lodash-es';
import {
  ref,
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
  INIT_VAL_TYPE,
} from '@/constants';
import {
  SELECT_COMP_TYPE,
  NOOP,
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
  initValType: String,
});

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

watch(() => props.initValType, () => setInitVal(), { immediate: true });

watchMap.unwatchUpdateValue = watch(() => unref(innerOptions), () => {
  setInitVal();
}, { immediate: true });

function setInitVal() {
  if (props.initValType !== INIT_VAL_TYPE.FIRST) {
    return;
  }
  updateValue(get(unref(innerOptions), ['0', props.valueField]));
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

const allItemClass = computed(() => {
  return {};
});


function onClickAllItem() {

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
    @update:value="onUpdateValue"
  >
    <template #dropdownRender="{ menuNode }">
      <div
        class="ant-select-item ant-select-item-option"
        :class="allItemClass"
        @click="onClickAllItem"
      >
        全选
      </div>
      <ADivider style="margin: 4px 0" />
      <component :is="() => menuNode" />
    </template>
  </RSelect>
</template>
<style scoped>
</style>
