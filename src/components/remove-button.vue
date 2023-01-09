<script setup>
defineProps({
  getPopupContainer: Function,
  placement: String,
});

defineEmits([
  'click',
]);
</script>
<script>
export default {
  inheritAttrs: false,
};
</script>
<template>
  <APopconfirm
    title="确认要删除吗？"
    :getPopupContainer="getPopupContainer"
    :placement="placement"
    @confirm="$emit('click', $event)"
  >
    <RButton danger v-bind="$attrs">
      <slot />
      删除
    </RButton>
  </APopconfirm>
</template>
<style scoped>
</style>
