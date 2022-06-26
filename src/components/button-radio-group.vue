<script setup>
const props = defineProps({
  options: Array,
});
const emit = defineEmits([
  'change',
]);

function onChange(e) {
  emit('change', e?.target?.value);
}
</script>
<template>
  <ARadioGroup @change="onChange">
    <ARadioButton v-for="item in props.options"
      :key="item.value"
      v-bind="item"
    >
      {{item.label}}
    </ARadioButton>
  </ARadioGroup>
</template>
