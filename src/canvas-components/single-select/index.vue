<script setup>
import {
  computed,
} from 'vue';

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
  options: Array,
  optionsDS: String,
  compType: {
    type: String,
    default: 'select',
  },
});

const emit = defineEmits([
  'update:value',
  'update:var',
]);

const innerPlaceholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder;
  }
  const target = props.label || '数据';
  return `请选择${target}`;
});

const innerOptions = computed(() => {
  return props.options;
});

function onUpdateValue(value) {
  emit('update:value', value);
  emit('update:var', {
    varId: props.exportDS1,
    value,
  });
}

</script>
<template>
  <ButtonRadioGroup v-if="compType === 'buttonRadio'"
    :options="innerOptions"
    @update:value="onUpdateValue"
  />
  <RadioGroup v-else-if="compType === 'radio'"
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
