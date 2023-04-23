<script setup>
import {
  ref,
  shallowRef,
  watch,
  unref,
} from 'vue';
import {
  map,
  forEach,
} from 'lodash-es';
import {
  DatabaseOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue';
import {
  DATA_SOURCE_TYPE_NAME,
  MANUAL_DATA_SOURCE_TYPE_NAME,
} from '@/constants';
import {
  useDSPoolStore,
  getEditorDSInfo,
  unRegisterEditorDS,
} from '@/stores/ds-pool';
import DSEditorDrawer from './editor-drawer';
import {
  onClickAdd,
  onClickModify,
  onClickClone,
} from './use-data-source';

const dsPoolStore = useDSPoolStore();

const columns = [{
  dataIndex: 'id',
  name: '数据源ID',
  width: 220,
}, {
  dataIndex: 'name',
  name: '数据源名字',
  width: 220,
}, {
  dataIndex: 'typeName',
  name: '类型',
  width: 150,
}, {
  dataIndex: 'status',
  name: '状态',
  width: 150,
}, {
  dataIndex: 'errMsg',
  name: '错误',
  width: 150,
}, {
  dataIndex: 'valueStr',
  name: '值',
}, {
  name: '操作',
  dataIndex: 'ops',
  isOperator: true,
  width: 130,
  ops: {
    modify: {
      text: '修改',
      onClick: onClickModify,
    },
    clone: {
      text: '克隆',
      onClick: onClickClone,
    },
    remove: {
      text: '删除',
      isDelete: true,
      onClick: onClickRemove,
    },
  },
}];

const typeOpts = map(DATA_SOURCE_TYPE_NAME, (label, value) => ({ label, value }));

const visible = ref(false);
const nameFilter = ref();
const typeFilter = ref([]);

const dataSource = shallowRef([]);

watch(() => [
  dsPoolStore.editorDSIdList,
  unref(visible),
  unref(nameFilter),
  unref(typeFilter),
], () => {
  if (!unref(visible)) {
    return;
  }
  const list = [];
  forEach(getEditorDSInfo(), item => {
    if ((unref(nameFilter) || '').trim()) {
      const { id, name } = item;
      const reg = new RegExp(unref(nameFilter).trim(), 'i');
      if (!reg.test(id) && !reg.test(name)) {
        return;
      }
    }
    const { type } = item;
    if (unref(typeFilter)?.length) {
      if (unref(typeFilter).indexOf(type) === -1) {
        return;
      }
    }
    const { value } = item;
    list.push({
      ...item,
      typeName: DATA_SOURCE_TYPE_NAME[type] || type,
      valueStr: value ? JSON.stringify(value) : value,
      ops: (options) => {
        if (!MANUAL_DATA_SOURCE_TYPE_NAME[type]) {
          return {
            stop: {
              component: 'div',
              text: '不可修改和删除',
            },
          };
        }
      },
    });
  });

  dataSource.value = list;
});

function onClickRemove(options) {
  unRegisterEditorDS(options?.record?.id);
}

</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <RButton v-bind="$attrs" @click="() => visible = true">
    <ATooltip title="数据池管理" placement="bottomRight">
      <DatabaseOutlined class="f-18" />
    </ATooltip>
  </RButton>
  <RDrawer
    v-model:visible="visible"
    title="数据池"
    width="100%"
    :footer="false"
  >
    <div class="align-center mb-10">
      <div class="flex-grow">
        <AButton
          type="primary"
          @click="onClickAdd"
        >
          <PlusOutlined />
          新增
        </AButton>
      </div>
      <div class="align-center p-5 gray-bg">
        <div class="filter-desc mr-10">筛选条件</div>
        <div class="flex-0-0">ID或名字：</div>
        <RInput
          class="mr-20 filter-input"
          v-model:value="nameFilter"
          placeholder="输入id或名字检索"
        />
        <div class="flex-0-0">类型：</div>
        <div>
          <ButtonCheckboxGroup
            v-model:value="typeFilter"
            :options="typeOpts"
          />
        </div>
      </div>
    </div>
    <RTable
      :columns="columns"
      :dataSource="dataSource"
    />
  </RDrawer>
  <DSEditorDrawer />
</template>
<style scoped>
.filter-desc {
  padding: 0 8px;
  border-right: 2px solid;
}
.filter-input {
  width: 400px;
}
</style>
