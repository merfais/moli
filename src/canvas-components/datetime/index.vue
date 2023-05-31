<script setup>
import {
  computed,
  ref,
  watch,
} from 'vue';
import {
  isEmpty,
} from 'lodash-es';
import {
  watchEditorDS,
  getEditorDSValue,
} from '@/stores/ds-pool';
import {
  NOOP,
} from '../constants';

const props = defineProps({
  placeholder: String,
  label: String,
  exportDS1: String,
  depDSs: Object,
  valueFormat: String,
});

const emit = defineEmits([
  'update:value',
  'update:ds',
]);

const unwatchMap = {
  disabled: NOOP,
};

const disabled = ref(false);

const innerPlaceholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder;
  }
  const target = props.label || '时间';
  return `请选择${target}`;
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

</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <RDatetimePicker
    :placeholder="innerPlaceholder"
    :disabled="disabled"
    v-bind="$attrs"
    @update:value="onUpdateValue"
  />
  <div class="p-absolute xx">
    <RichDatetimePicker
      :placeholder="innerPlaceholder"
      :disabled="disabled"
      v-bind="$attrs"
      @update:value="onUpdateValue"
    />
  </div>
</template>
<style scoped>
.xx {
  right: 0;
  top: 0;
}
</style>
