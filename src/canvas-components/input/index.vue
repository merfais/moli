<script setup>
import {
  computed,
} from 'vue';

const props = defineProps({
  placeholder: String,
  multiple: Boolean,
});

const emit = defineEmits([
  'update:value',
  'update:var',
]);

const innerPlaceholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder;
  }
  return props.multiple
    ? '请输入内容，多值请用英文逗号,分隔'
    : '请输入内容';
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
