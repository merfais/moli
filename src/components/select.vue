<script setup>
defineProps({
  loading: Boolean,
});
defineEmits([
  'change',
  'update:value',
]);
</script>
<template>
  <ASelect
    :loading="loading"
    optionFilterProp="label"
    allowClear
    showSearch
    showArrow
    v-bind="$attrs"
    @change="v => $emit('change', v)"
    @update:value="v => $emit('update:value', v)"
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
  </ASelect>
</template>
<style scoped>
.loading-wrapper {
  height: 65px;
}
</style>
