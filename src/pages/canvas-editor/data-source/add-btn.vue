<script setup>
import {
  useDataSourceEditorStore,
} from '../use-store';

defineProps({
  getContainer: Function,
});
const dsEditorStore = useDataSourceEditorStore();

function onClickAdd() {
  dsEditorStore.$reset();
  dsEditorStore.visible = true;
}
</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <AButton
    v-bind="$attrs"
    @click="onClickAdd"
  >
    新建数据源
  </AButton>
  <RDrawer
    v-model:visible="dsEditorStore.visible"
    :title="dsEditorStore.title"
    :getContainer="getContainer"
  >
  </RDrawer>
</template>
<style scoped>
</style>
