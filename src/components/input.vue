<script setup>
defineProps({
  preText: String,
  postText: String,
});
</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <div v-if="preText || postText" class="align-center">
    <span v-if="preText" class="flex-0-0 pr-5">{{preText}}</span>
    <AInput
      allowClear
      v-bind="$attrs"
    />
    <span v-if="postText" class="flex-0-0 pl-5">{{postText}}</span>
  </div>
  <AInput v-else
    allowClear
    v-bind="$attrs"
  />
</template>
<style scoped>
</style>
