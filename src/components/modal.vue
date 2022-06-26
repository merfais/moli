<script setup>
</script>
<template>
  <AModal
    destroyOnClose
  >
    <template v-for="(n, slotName) of $slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName"
        v-bind="{ ...slotProps }"
      />
    </template>
  </AModal>
</template>
<style scoped>
</style>
