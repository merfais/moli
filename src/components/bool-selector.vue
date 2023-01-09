<script setup>
import ButtonRadioGroup from './button-radio-group';

const options = [
  { label: '是', value: true },
  { label: '否', value: false },
];
</script>
<template>
  <ButtonRadioGroup
    :options="options"
  />
</template>
<style scoped>
</style>
