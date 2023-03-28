<script setup>
import {
  useDataSourceEditorStore,
} from '../use-store';
import {
  onClickAdd,
  onClickSave,
} from './use-data-source';

defineProps({
  getContainer: Function,
});
const dsEditorStore = useDataSourceEditorStore();

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
    width="1100px"
    @ok="onClickSave"
  >
    <RForm
      :ref="el => dsEditorStore.form = el"
      :formItems="dsEditorStore.formItems"
    />
  </RDrawer>
</template>
<style scoped>
</style>
