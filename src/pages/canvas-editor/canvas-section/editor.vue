<script setup>
import {
  set,
  cloneDeep,
} from 'lodash-es';
import {
  ref,
  unref,
  watch,
  computed,
  shallowRef,
  onMounted,
} from 'vue';
import { message } from 'ant-design-vue';
import { getConfEditorMap } from '@/canvas-components';
import {
  useCanvasEditorStore,
} from '../use-canvas-editor';
import useCompEditorStore from './use-store';

const store = useCompEditorStore();

const selectedKeys = ref(['conf']);
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

async function genFormItems() {
  const [conf] = await Promise.all([
    getConfEditorMap(store.compKey),
  ]);
  compMap.value = { conf };
}

async function onOk() {
  try {
    await unref(formRef).validate();
  } catch (e) {
    console.warn('表单校验失败', e);
    message.warn('校验未通过，请检查');
  }
  const canvasStore = useCanvasEditorStore();
  set(canvasStore.viewMap, store.i, cloneDeep(store.viewConf));
  store.visible = false;
}

</script>
<template>
  <div ref="domRef" class="editor-drawer-container"/>
  <RDrawer
    v-model:visible="store.visible"
    :getContainer="() => $refs.domRef"
    @ok="onOk"
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
        <AMenuItem key="conf">数据</AMenuItem>
        <AMenuItem key="style">样式</AMenuItem>
      </AMenu>
      <Form ref="formRef"
        class="width-100 pt-20 pb-20"
        layout="horizontal"
        :labelCol="{ span: 4, style: { minWidth: '150px' } }"
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

  :deep(.ant-menu) {
    background: #fafafa;
  }

  :deep(.ant-menu-item) {
    padding: 6px !important;
    margin: 0;
    height: 100px;
    line-height: 1.4em;
    border-bottom: 1px solid #f0f0f0;

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
