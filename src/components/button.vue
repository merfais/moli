<script setup>
defineProps({
  color: {
    type: String,
    default: 'unset',
  },
});
</script>
<template>
  <AButton class="r-button" type="link"><slot /></AButton>
</template>
<style scoped>
.r-button:not(:hover,:active,[disabled],.ant-btn-primary,.ant-btn-dangerous) {
  color: v-bind(color);
}
</style>
