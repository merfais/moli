<script setup>
</script>
<template>
  <div class="phone-container flex-column">
    <div class="bg-head" />
    <div class="inner-wrapper">
      <slot />
    </div>
  </div>
</template>
<style scoped>
.phone-container {
  width: 421px;
  min-height: 700px;
  margin: 5px;
  background-image: url(@/assets/phone.png);
  background-size: 100% 100%;
  overflow: hidden;
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;

  .bg-head {
    height: 109px;
    background-image: url(@/assets/phone.png);
    background-size: 100% auto;
  }

  .inner-wrapper {
    flex-grow: 1;
    overflow: hidden;
    border-radius: 0 0 30px 30px;
    margin: 0 22px 18px 23px;
    height: calc(100% - 109px);
    position: relative;
  }
}
</style>
