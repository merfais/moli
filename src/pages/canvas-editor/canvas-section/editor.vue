<script setup>
import {
  set,
  cloneDeep,
  map,
  get,
} from 'lodash-es';
import {
  ref,
  unref,
  watch,
  shallowRef,
  onMounted,
} from 'vue';
import { message } from 'ant-design-vue';
import {
  CloseOutlined,
} from '@ant-design/icons-vue';
import {
  editorConfMap,
  EDITOR_MENU,
  EDITOR_MENU_NAME,
} from '@/canvas-components';
import {
  useCanvasEditorStore,
} from '../use-canvas-editor';
import useCompEditorStore from './use-store';

const editor = useCompEditorStore();

const selectedKeys = ref([EDITOR_MENU.BASIC]);
const formRef = ref();
const editorConf = shallowRef({});

onMounted(() => {
});

watch(() => editor.visible, () => {
  if (editor.visible) {
    selectedKeys.value = [EDITOR_MENU.BASIC];

    const getEditorConf = editorConfMap[editor.compKey];
    if (getEditorConf) {
      editorConf.value = getEditorConf(editor);
    } else {
      editorConf.value = { [editorConfMap.BASIC]: {} };
    }
  } else {
    editorConf.value = {};
  }
});

async function onOk() {
  try {
    await Promise.all(map(unref(formRef), item => item.validate()));
  } catch (e) {
    console.warn('表单校验失败', e);
    message.warn('校验未通过，请检查');
    const formKey = get(e, 'values.formKey');
    if (EDITOR_MENU_NAME[formKey]) {
      selectedKeys.value = [formKey];
    }
    return;
  }
  const canvasStore = useCanvasEditorStore();
  set(canvasStore.viewMap, editor.i, cloneDeep(editor.viewConf));
  editor.visible = false;
}

</script>
<template>
  <div ref="domRef" class="editor-drawer-container"/>
  <RDrawer
    v-model:visible="editor.visible"
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
        <AMenuItem v-for="(item, key) in editorConf"
          :key="key"
        >
          {{EDITOR_MENU_NAME[key]}}
        </AMenuItem>
      </AMenu>
    </template>
    <template #extra>
      <button class="ant-drawer-close" @click="editor.visible = false">
        <CloseOutlined />
      </button>
    </template>
    <template v-for="(formItems, key) in editorConf"
      :key="key"
    >
      <RForm v-show="key === selectedKeys[0]"
        ref="formRef"
        class="width-100 pt-10 pb-20"
        layout="horizontal"
        :labelCol="{ span: 4, style: { minWidth: '150px' } }"
        :wrapperCol="{ span: 18 }"
        :loading="editor.loading"
        :formItems="formItems"
      >
        <template #divider="{ text }">
          <div class="col-24 divider pl-20 p-relative">
            {{text}}
          </div>
        </template>
      </RForm>
    </template>
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

  .divider {
    font-size: 16px;
    font-weight: 550;
    margin: 0 20px 10px 10px;
    overflow: hidden;

    &:before {
      content: '';
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-left: 10px solid #aaa;
    }
  }
}
</style>
