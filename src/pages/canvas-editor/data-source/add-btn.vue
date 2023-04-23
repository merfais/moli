<script setup>
import EditorDrawer from './editor-drawer';
import {
  onClickAdd,
} from './use-data-source';

const props = defineProps({
  getContainer: Function,
  uid: String,
});

</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <AButton
    v-bind="$attrs"
    @click="() => onClickAdd(props.uid)"
  >
    新建数据源
  </AButton>
  <EditorDrawer
    :getContainer="getContainer"
    :uid="uid"
  />
</template>
<style scoped>
</style>
