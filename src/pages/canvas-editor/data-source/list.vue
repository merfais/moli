<script setup>
import {
  ref,
  shallowRef,
  watch,
  unref,
} from 'vue';
import {
  map,
} from 'lodash-es';
import {
  DatabaseOutlined,
} from '@ant-design/icons-vue';
import {
  DATA_SOURCE_TYPE_NAME,
} from '@/constants';
import {
  useDSPoolStore,
  getEditorDSInfo,
} from '@/stores/ds-pool';
import {
  onClickModify,
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
const typeFilter = ref();

const dataSource = shallowRef([]);

watch(() => [
  dsPoolStore.editorDSIdList,
  unref(visible),
], () => {
  if (!unref(visible)) {
    return;
  }
  dataSource.value = map(getEditorDSInfo(), item => {
    const { value, type } = item;
    return {
      ...item,
      typeName: DATA_SOURCE_TYPE_NAME[type] || type,
      valueStr: value ? JSON.stringify(value) : value,
    };
  });
});

function onClickRemove() {

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
  >
    <div class="align-center mb-10">
      <div class="flex-0-0">ID或名字：</div>
      <RInput
        class="mr-20 filter-input"
        v-model:value="nameFilter"
        placeholder="输入id或名字检索"
      />
      <div class="flex-0-0">类型：</div>
      <ButtonCheckboxGroup
        v-model:value="typeFilter"
        :options="typeOpts"
      />
    </div>
    <RTable
      :columns="columns"
      :dataSource="dataSource"
    />
  </RDrawer>
</template>
<style scoped>
.filter-input {
  width: 400px;
}
</style>
