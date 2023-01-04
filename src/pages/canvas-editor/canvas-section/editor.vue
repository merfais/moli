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
import {
  CloseOutlined,
} from '@ant-design/icons-vue';
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
    return;
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
    :closable="false"
    @ok="onOk"
  >
    <template #title>
      <AMenu v-model:selectedKeys="selectedKeys"
        class="menu"
        size="small"
        mode="horizontal"
      >
        <AMenuItem key="conf">基础配置</AMenuItem>
        <AMenuItem key="label">Label 配置</AMenuItem>
        <AMenuItem key="var">变量配置</AMenuItem>
        <AMenuItem key="layout">布局配置</AMenuItem>
        <AMenuItem key="style">样式配置</AMenuItem>
      </AMenu>
    </template>
    <template #extra>
      <button class="ant-drawer-close" @click="store.visible = false">
        <CloseOutlined />
      </button>
    </template>
    <Form ref="formRef"
      class="width-100 pt-10 pb-20"
      layout="horizontal"
      :labelCol="{ span: 4, style: { minWidth: '150px' } }"
      :wrapperCol="{ span: 18 }"
      :loading="store.loading"
      :model="store.viewConf"
    >
      <component :is="is" />
    </Form>
  </RDrawer>
</template>
<style scoped>
.editor-drawer-container {
  :deep(.ant-drawer-header) {
    background: #fafafa;
    padding: 0;
  }
  :deep(.ant-drawer-body) {
    padding: 0;
  }

  :deep(.ant-menu) {
    background: #fafafa;
  }

  :deep(.ant-menu-item) {
    border-right: 1px solid #f0f0f0;

    &:after {
      left: 1px;
      right: 1px;
    }

    &.ant-menu-item-selected {
      background: var(--ant-primary-1);
    }
  }

  .ant-drawer-close {
    background: #fafafa;
  }

  .menu {
  }
}
</style>
