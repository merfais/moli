<script setup>
import {
  useDataSourceEditorStore,
} from '../use-store';
import {
  onClickSave,
} from './use-data-source';

defineProps({
  uid: String,
});
const dsEditorStore = useDataSourceEditorStore();

</script>
<template>
  <RDrawer
    :visible="dsEditorStore.visible && dsEditorStore.uid == uid"
    :title="dsEditorStore.title"
    width="1100px"
    @ok="onClickSave"
    @update:visible="v => dsEditorStore.visible = v"
  >
    <RForm
      :ref="el => dsEditorStore.form = el"
      :formItems="dsEditorStore.formItems"
    />
  </RDrawer>
</template>
<style scoped>
</style>
