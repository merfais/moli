<script setup>
const emit = defineEmits([
  'change',
]);

function onChange(e) {
  emit('change', e?.target?.value);
}
</script>
<template>
  <ARadioGroup
    @change="onChange"
  />
</template>
