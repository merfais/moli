<script setup>
import {
  ref,
  unref,
  watch,
  computed,
  shallowRef,
  onMounted,
} from 'vue';
import {
  useViewEditorStore,
} from './use-editor';

const store = useViewEditorStore();

const selectedKeys = ref(['data']);
const formRef = ref();
const compMap = shallowRef({});

const is = computed(() => {
  const [key] = unref(selectedKeys) || [];
  return unref(compMap)[key] || 'div';
});

onMounted(() => {
  genFormItems();
});

watch(() => store.visible, () => {
  if (store.visible) {
    genFormItems();
  }
});

// addWatch(props.item, () => {
//   formItems.value = genFormItems();
// });

function genFormItems() {
  // const genFn = getFormItems(props.item);
  // if (genFn) {
  //   return genFn(props.item);
  // }
}

</script>
<template>
  <div ref="domRef" class="editor-drawer-container"/>
  <RDrawer
    v-model:visible="store.visible"
    :getContainer="() => $refs.domRef"
  >
    <template #title>
      {{store.title}}
    </template>
    <div class="d-flex height-100">
      <AMenu v-model:selectedKeys="selectedKeys"
        class="menu"
        size="small"
        mode="inline"
      >
        <AMenuItem key="data">数据</AMenuItem>
        <AMenuItem key="style">样式</AMenuItem>
      </AMenu>
      <Form ref="formRef"
        layout="horizontal"
        :wrapperCol="{ span: 18 }"
        :loading="store.loading"
        :model="store.viewConf"
      >
        <component :is="is" />
      </Form>
    </div>
  </RDrawer>
</template>
<style scoped>
.editor-drawer-container {
  :deep(.ant-drawer-body) {
    padding: 0px;
  }

  :deep(.ant-menu-item) {
    padding: 6px !important;
    margin: 0;
    height: 100px;
    line-height: 1.4em;

    .ant-menu-title-content {
      word-break: break-all;
      word-wrap: break-word;
      white-space: normal;
    }
  }

  .menu {
    width: 30px;
  }
}
</style>
