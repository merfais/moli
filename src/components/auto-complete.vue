<script setup>
defineProps({
  loading: Boolean,
});
function filterOption(filter, option) {
  const { label, value } = option || {};
  const reg = new RegExp(filter, 'i');
  return reg.test(label) || reg.test(value);
}
</script>
<template>
  <AAutoComplete
    allowClear
    :filterOption="filterOption"
  >
    <template v-for="(n, slotName) of $slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName"
        v-bind="{ ...slotProps }"
      />
    </template>
    <template v-if="loading" #notFoundContent>
      <div class="loading-wrapper d-flex">
        <ASpin class="flex-center flex-grow"/>
      </div>
    </template>
  </AAutoComplete>
</template>
<style scoped>
</style>
