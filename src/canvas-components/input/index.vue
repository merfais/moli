<script setup>
import {
  computed,
} from 'vue';

const props = defineProps({
  placeholder: String,
  multiple: Boolean,
  label: String,
});

const emit = defineEmits([
  'update:value',
  'update:var',
]);

const innerPlaceholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder;
  }
  const target = props.label || '内容';
  return props.multiple
    ? `请输入${target}，多值请用英文逗号,分隔`
    : `请输入${target}`;
});

function onUpdateValue(value) {
  emit('update:value', value);
}
</script>
<template>
  <AInput
    :placeholder="innerPlaceholder"
    @update:value="onUpdateValue"
  />
</template>
<style scoped>
</style>
