<script setup>
import {
  set,
  cloneDeep,
  map,
  get,
  forEach,
} from 'lodash-es';
import {
  ref,
  unref,
  watch,
  shallowRef,
  onMounted,
  onBeforeUnmount,
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
  updateEditorDS,
} from '@/stores/ds-pool';
import AddDataSourceBtn from './data-source/add-btn';
import {
  useCanvasEditorStore,
  useCompEditorStore,
} from './use-store';

const editorStore = useCompEditorStore();

const selectedKeys = ref([EDITOR_MENU.BASIC]);
const formRef = ref();
const editorConf = shallowRef({});

onMounted(() => {
});

onBeforeUnmount(() => {
  editorStore.$reset();
});

watch(() => editorStore.visible, () => {
  if (editorStore.visible) {
    selectedKeys.value = [EDITOR_MENU.BASIC];

    const getEditorConf = editorConfMap[editorStore.compKey];
    if (getEditorConf) {
      editorConf.value = getEditorConf(editorStore);
    } else {
      editorConf.value = { [EDITOR_MENU.BASIC]: {} };
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
  const oldComp = get(canvasStore.viewMap, editorStore.i);
  const viewConf = cloneDeep(editorStore.viewConf);

  // 保存DataSource
  forEach(editorStore.dataSource, (item, expKey) => {
    const oldId = oldComp[expKey];
    updateEditorDS({
      oldId,
      id: item.id,
      name: item.name,
      valueType: viewConf.valueType,
      value: viewConf.value,
    });

    viewConf[expKey] = item.id;
    if (viewConf?.exportDSs?.indexOf && viewConf.exportDSs.indexOf(oldId) !== -1) {
      viewConf.exportDSs[viewConf.exportDSs.indexOf(oldId)] = item.id;
    }
  });

  // 保存viewConf
  set(canvasStore.viewMap, editorStore.i, viewConf);

  // 保存layout
  if (editorStore.index !== -1) {
    set(canvasStore.pcLayoutMap.root, editorStore.index, editorStore.pcLayout);
  }

  onCancel();
}

function onCancel() {
  editorStore.$reset();
}

</script>
<template>
  <div ref="domRef" class="editor-drawer-container"/>
  <ADrawer
    class="comp-editor-drawer"
    destroyOnClose
    width="1000px"
    :keyboard="false"
    :visible="editorStore.visible"
    :getContainer="() => $refs.domRef"
    :closable="false"
    @close="onCancel"
  >
    <template #title>
      <AMenu v-model:selectedKeys="selectedKeys"
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
      <button class="ant-drawer-close" @click="onCancel">
        <CloseOutlined />
      </button>
    </template>
    <template #footer>
      <div class="flex-grow">
        <AddDataSourceBtn
          :getContainer="() => $refs.domRef"
          uid="inCompEditor"
        />
      </div>
      <AButton @click="onCancel">
        取消
      </AButton>
      <AButton
        class="ml-10"
        type="primary"
        @click="onOk"
      >
        确认
      </AButton>
    </template>
    <template v-for="(formItems, key) in editorConf"
      :key="key"
    >
      <RForm v-show="key === selectedKeys[0]"
        ref="formRef"
        class="width-100 pt-20 pb-20"
        layout="horizontal"
        :labelCol="{ span: 4, style: { minWidth: '150px' } }"
        :wrapperCol="{ span: 18 }"
        :loading="editorStore.loading"
        :formItems="formItems"
      >
        <template #divider="{ text }">
          <div class="col-24 divider pl-20 p-relative">
            {{text}}
          </div>
        </template>
      </RForm>
    </template>
  </ADrawer>
</template>
<style scoped>
:deep(.comp-editor-drawer) {
  .ant-drawer-header {
    background: #fafafa;
    padding: 0;
  }

  .ant-drawer-body {
    padding: 0;
  }

  .ant-drawer-footer {
    display: flex;
  }

  .ant-menu {
    background: #fafafa;
  }

  .ant-menu-item {
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

  .divider {
    font-size: 16px;
    font-weight: 550;
    margin: 0 20px 10px 10px;
    overflow: hidden;
  }
}
</style>
