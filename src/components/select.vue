<script setup>
defineProps({
  loading: Boolean,
});
</script>
<template>
  <ASelect
    :loading="loading"
    optionFilterProp="label"
    allowClear
    showSearch
    v-bind="$attrs"
  >
    <slot />
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
