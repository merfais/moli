<script setup>
defineProps({
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
  <ARadioGroup
    @change="onChange"
  >
    <ARadio v-for="item in options"
      :key="item.value"
      :value="item.value"
      :title="item.title"
    >
      {{item.label}}
    </ARadio>
  </ARadioGroup>
</template>

