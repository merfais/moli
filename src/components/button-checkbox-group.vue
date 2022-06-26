<script setup>
import { computed, unref, useAttrs } from 'vue';
import { omit, has } from 'lodash-es';

const props = defineProps({
  value: {
    type: Array,
    default: () => ([]),
  },
  options: {
    type: Array,
    default: () => ([]),
  },
});
const emit = defineEmits([
  'update:value',
  'change',
]);

const attrs = useAttrs();

const checkedValues = computed(() => new Set(props.value));
const getProps = (item) => {
  const rest = omit(item, ['value']);
  if (has(attrs, 'disabled')) {
    rest.disabled = attrs.disabled;
  }
  return rest;
};

const onUpdate = (item, checked) => {
  const value = unref(item.value);
  if (checked) {
    const payload = [...props.value, value];
    emit('update:value', payload);
    emit('change', payload);
    return;
  }
  checkedValues.value.delete(value);
  const payload = [...checkedValues.value];
  emit('update:value', payload);
  emit('change', payload);
};
</script>
<template>
  <AInputGroup compact>
    <ButtonCheckbox v-for="item in options"
      :key="item.value"
      v-bind="getProps(item)"
      :value="checkedValues.has(item.value)"
      @update:value="onUpdate(item, $event)"
    >
      {{item.label}}
    </ButtonCheckbox>
  </AInputGroup>
</template>
<style scoped>
</style>
