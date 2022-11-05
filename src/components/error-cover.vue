<script setup>
defineProps({
  errMsg: String,
});
</script>
<template>
  <div v-if="errMsg"
    class="cover white-bg error-color flex-center"
  >
    出错：{{ errMsg}}
  </div>
</template>
<style scoped>
</style>
