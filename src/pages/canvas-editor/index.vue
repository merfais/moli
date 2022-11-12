<script setup>
import HeaderSection from './header-section';
import ToolboxSection from './toolbox-section';
</script>
<template>
  <div class="height-100">
    <HeaderSection />
    <section class="page-body height-100">
      <ToolboxSection />
      <section class="canvas-container">
      </section>
    </section>
  </div>
</template>
<style scoped>
.page-body {
  padding-top: 50px;
}
</style>
