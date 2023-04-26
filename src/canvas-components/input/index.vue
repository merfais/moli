<script setup>
import {
  computed,
  ref,
  watch,
  unref,
} from 'vue';
import {
  isEmpty,
} from 'lodash-es';
import { useFocus } from '@vueuse/core';
import {
  watchEditorDS,
  getEditorDSValue,
} from '@/stores/ds-pool';
import {
  NOOP,
} from '../constants';

const props = defineProps({
  placeholder: String,
  multiple: Boolean,
  label: String,
  exportDS1: String,
  depDSs: Object,
});

const emit = defineEmits([
  'update:value',
  'update:ds',
  'update:focused',
]);

const unwatchMap = {
  disabled: NOOP,
};

const disabled = ref(false);
const inputDomRef = ref();
const { focused } = useFocus(inputDomRef);

const innerPlaceholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder;
  }
  const target = props.label || '内容';
  return props.multiple
    ? `请输入${target}，多值请用英文逗号,分隔`
    : `请输入${target}`;
});

watch(focused, () => {
  emit('update:focused', unref(focused));
});

watch(() => props?.depDSs?.disabled, () => {
  unwatchMap.disabled();
  if (!props?.depDSs?.disabled) {
    disabled.value = false;
    return;
  }
  unwatchMap.disabled = watchEditorDS(props.depDSs.disabled, () => {
    const value = getEditorDSValue(props.depDSs.disabled);
    if (typeof value === 'object') {
      disabled.value = !isEmpty(value);
    } else {
      disabled.value = !!value;
    }
  }, { immediate: true });
}, { immediate: true });

function onUpdateValue(value) {
  emit('update:value', value);
  emit('update:ds', {
    dsId: props.exportDS1,
    value,
  });
}

function onDbClick() {
  focused.value = true;
}
</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <AInput ref="inputDomRef"
    :placeholder="innerPlaceholder"
    :disabled="disabled"
    v-bind="$attrs"
    @update:value="onUpdateValue"
  />
  <div v-if="!focused"
    class="p-absolute width-100 height-100 input-cover"
    @dblclick="onDbClick"
  />
</template>
<style scoped>
.input-cover {
  top: 0;
  left: 0;
}
</style>
