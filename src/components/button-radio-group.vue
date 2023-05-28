<script setup>
const props = defineProps({
  options: Array,
  value: {},
  allowClear: Boolean,
});
const emit = defineEmits([
  'update:value',
  'change',
]);

function onUpdate(value) {
  emit('update:value', value);
  emit('change', value);
}

function onClick(item) {
  if (props.allowClear && item.value === props.value) {
    emit('update:value');
    emit('change');
  }
}
</script>
<template>
  <ARadioGroup
    :value="value"
    buttonStyle="solid"
    optionType="button"
    @update:value="onUpdate"
  >
    <ARadioButton v-for="item in options"
      :key="item.value"
      :value="item.value"
      :title="item.title || item.label"
      @click="onClick(item)"
    >
      {{item.label}}
    </ARadioButton>
  </ARadioGroup>
</template>

