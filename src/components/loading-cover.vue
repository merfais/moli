<script setup>
defineProps({
  loading: Boolean,
  is: {
    type: String,
    default: 'ASpin',
  },
});
</script>
<template>
  <div v-show="loading" class="cover flex-center white-025-bg">
    <component :is="is" />
  </div>
</template>
<style scoped>
</style>
