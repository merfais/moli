<script setup>
import {
  onBeforeUnmount,
} from 'vue';
import { destroyEditorDSPool } from '@/stores/ds-pool';
import HeaderSection from './header-section';
import ToolboxSection from './toolbox-section';
import Canvas from './canvas';
import {
  useCanvasEditorStore,
  useCompEditorStore,
  useDataSourceEditorStore,
} from './use-store';
import {
  init,
} from './use-canvas';

const canvasStore = useCanvasEditorStore();
const compEditorStore = useCompEditorStore();
const dsEditorStore = useDataSourceEditorStore();

init();

onBeforeUnmount(() => {
  destroyEditorDSPool();
  canvasStore.$reset();
  compEditorStore.$reset();
  dsEditorStore.$reset();
});
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
