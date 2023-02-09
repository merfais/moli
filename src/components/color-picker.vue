<script setup>
import {
  ElColorPicker,
} from 'element-plus';
import 'element-plus/es/components/color-picker/style/css';

defineProps({
  value: String,
  placeholder: String,
});
const emit = defineEmits([
  'update:value',
]);

function onUpdateValue(value) {
  emit('update:value', value);
}
</script>
<script>
export default {
  inheritAttrs: false,
};
</script>
<template>
  <div class="color-picker-wrapper align-center p-relative">
    <ElColorPicker
      :modelValue="value"
      v-bind="$attrs"
      @update:modelValue="onUpdateValue"
    />
    <AInput
      :value="value"
      :placeholder="placeholder"
      @update:value="onUpdateValue"
    />
  </div>
</template>
<style scoped>
.color-picker-wrapper {
  :deep(.el-color-picker__trigger) {
    border-radius: 2px 0 0 2px;
    border-right: 0;
  }

  :deep(.ant-input) {
    border-radius: 0 2px 2px 0;
  }
}
</style>
