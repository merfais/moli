<script setup>
defineProps({
  loading: Boolean,
});
</script>
<template>
  <div v-show="loading" class="cover flex-center white-bg">
    <ASpin />
  </div>
</template>
<style scoped>
</style>
