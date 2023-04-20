<script setup>
import HeaderSection from './header-section';
import ToolboxSection from './toolbox-section';
import Canvas from './canvas';
import {
  init,
} from './use-canvas';

init();

</script>
<template>
  <div class="height-100">
    <HeaderSection />
    <section class="page-body height-100 d-flex">
      <ToolboxSection />
      <Canvas class="flex-grow"/>
    </section>
  </div>
</template>
<style scoped>
.page-body {
  padding-top: 50px;
}
</style>
