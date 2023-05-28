<script setup>
import dayjs from 'dayjs';
import {
  useEventListener,
  useCurrentElement,
} from '@vueuse/core';

const emit = defineEmits([
  'update:value',
]);

const el = useCurrentElement();
useEventListener(el, 'dblclick', onDblClick);

function onDblClick() {
  emit('update:value', dayjs());
}

</script>
<template>
  <ADatePicker
    showTime
    @update:value="emit('update:value', $event)"
  />
</template>
<style scoped>
</style>
