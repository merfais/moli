<script setup>
import HeaderSection from './header-section';
import ToolboxSection from './toolbox-section';
import Canvas from './canvas';
import {
  useCanvasEditorStore,
} from './use-store';
import {
  init,
} from './use-canvas';

const canvasStore = useCanvasEditorStore();

init();

</script>
<template>
  <div class="height-100">
    <HeaderSection />
    <section class="page-body height-100 d-flex">
      <ToolboxSection />
      <Canvas class="flex-grow"/>
    </section>
    <LoadingCover
      class="z-2 white-025-bg"
      :loading="canvasStore.loading"
    />
  </div>
</template>
<style scoped>
.page-body {
  padding-top: 50px;
}
</style>
