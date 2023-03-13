<script setup>
defineProps({
  getPopupContainer: Function,
  placement: String,
  confirmText: {
    type: String,
    default: '确认要删除吗？',
  },
});

defineEmits([
  'click',
]);
</script>
<script>
export default { inheritAttrs: false };
</script>
<template>
  <APopconfirm
    :title="confirmText"
    :getPopupContainer="getPopupContainer"
    :placement="placement"
    @confirm="$emit('click', $event)"
  >
    <RButton danger v-bind="$attrs">
      <slot />
    </RButton>
  </APopconfirm>
</template>
<style scoped>
</style>
