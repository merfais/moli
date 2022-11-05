<script setup>
const props = defineProps({
  options: Array,
});
</script>
<template>
  <ACheckboxGroup>
    <ACheckbox v-for="item in props.options"
      :key="item.value"
      v-bind="item"
    >
      {{item.label}}
    </ACheckbox>
  </ACheckboxGroup>
</template>

