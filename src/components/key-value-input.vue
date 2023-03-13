<script setup>
import {
  ref,
  unref,
  computed,
  watch,
  shallowRef,
  reactive,
} from 'vue';
import {
  map,
  get,
  forEach,
  set,
} from 'lodash-es';
import { Form } from 'ant-design-vue';

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  'update:value',
]);

const inputTypeOptions = [{
  value: 'single',
  label: '单个输入',
}, {
  value: 'batch',
  label: '批量输入',
}];
const batchPlacehoder = `例如:
0，否
1，是
`;

const inputType = shallowRef('single');
const pagination = reactive({
  current: 1,
  pageSize: 10,
});
const batchValue = ref();

const dataSource = ref();
const formItemContext = Form.useInjectFormItemContext();

const innerCols = computed(() => {
  const keyCol = get(props.columns, [0]) || {};
  const valueCol = get(props.columns, [1]) || {};
  return [{
    key: 'index',
    dataIndex: 'index',
    name: '序号',
  }, {
    key: 'key',
    dataIndex: 'key',
    name: 'KEY',
    component: 'AInput',
    compProps: { size: 'small' },
    ...keyCol,
    'onUpdate:value': onUpdateKey,
  }, {
    key: 'value',
    dataIndex: 'value',
    name: 'VALUE',
    component: 'AInput',
    compProps: { size: 'small' },
    ...valueCol,
    'onUpdate:value': onUpdateValue,
  }, {
    isOperator: true,
    ops: {
      add: {
        text: '新增',
        onClick: onClickAdd,
      },
      remove: {
        text: '删除',
        isDelete: true,
        compProps: {
          danger: true,
        },
        onClick: onClickRemove,
      },
    },
  }];
});

const keyField = computed(() => get(unref(innerCols), '[1].dataIndex') || 'key');
const valField = computed(() => get(unref(innerCols), '[2].dataIndex') || 'value');
const tips = computed(() => {
  const keyName = get(unref(innerCols), '[1].name') || 'KEY';
  const valName = get(unref(innerCols), '[2].name') || 'VALUE';
  return `一条数据占一行，逗号分隔${keyName}和${valName}，`
    + `第1列是${keyName}，第2列是${valName}`;
});

watch(() => props.value, () => {
  if (!Array.isArray(props.value)) {
    return;
  }
  const keyF = unref(keyField);
  const valF = unref(valField);
  if (!props.value?.length) {
    dataSource.value = [{
      [keyF]: { compProps: { value: undefined } },
      [valF]: { compProps: { value: undefined } },
      index: 0,
      isFake: true,
    }];
  } else {
    dataSource.value = dataSource.value || [];
    dataSource.value.length = props.value.length;
    forEach(props.value, (valItem = {}, index) => {
      const item = get(unref(dataSource), [index]) || {};
      set(item, `${keyF}.compProps.value`, get(valItem, keyF));
      set(item, `${valF}.compProps.value`, get(valItem, valF));
      set(item, 'index', index);
      delete item.isFake;
      dataSource.value[index] = item;
    });
  }
}, { immediate: true });

function onTableChange(paginationOptions) {
  Object.assign(pagination, paginationOptions);
}

function onUpdate(value) {
  emit('update:value', value);
  formItemContext.clearValidate();
  formItemContext.onFieldChange();
}

function onUpdateKey({ value, record }) {
  const keyF = unref(keyField);
  const valF = unref(valField);
  const { index, isFake } = record;
  const list = isFake ? [{ [keyF]: undefined, [valF]: undefined }] : [...props.value];
  const item = { [valF]: undefined, ...list[index], [keyF]: value };
  list[index] = item;
  onUpdate(list);
}

function onUpdateValue({ value, record }) {
  const keyF = unref(keyField);
  const valF = unref(valField);
  const { index, isFake } = record;
  const list = isFake ? [{ [keyF]: undefined, [valF]: undefined }] : [...props.value];
  const item = { [keyF]: undefined, ...list[index], [valF]: value };
  list[index] = item;
  onUpdate(list);
}

function onClickAdd({ record }) {
  const keyF = unref(keyField);
  const valF = unref(valField);
  const { index, isFake } = record;
  const list = isFake ? [{ [keyF]: undefined, [valF]: undefined }] : [...props.value];
  list.splice(index + 1, 0, {
    [keyF]: undefined,
    [valF]: undefined,
  });
  onUpdate(list);
  if (index + 1 === pagination.current * pagination.pageSize) {
    pagination.current += 1;
  }
}

function onClickRemove({ record }) {
  const { index, isFake } = record;
  if (isFake) {
    return;
  }
  const list = [...props.value];
  list.splice(index, 1);
  onUpdate(list);
  if (index === pagination.current * pagination.pageSize) {
    pagination.current -= 1;
  }
}

function onChangeInputType(value) {
  inputType.value = value;
  if (value === 'single') {
    const list = batchValToList(unref(batchValue));
    onUpdate(list);
    return;
  }
  const keyF = unref(keyField);
  const valF = unref(valField);
  const str = map(props.value, (valItem) => {
    const keyStr = toString(get(valItem, keyF));
    const valueStr = toString(get(valItem, valF));
    return `${keyStr}, ${valueStr}`;
  }).join('\n');
  batchValue.value = str;
}

function onUpdateBatchValue(value) {
  batchValue.value = value;
  const list = batchValToList(unref(batchValue));
  onUpdate(list);
}

function toString(value) {
  return value || value === 0 || value === false ? value : '';
}

function batchValToList(value) {
  if (!value || !value.trim()) {
    return [];
  }
  const keyF = unref(keyField);
  const valF = unref(valField);
  const list = map(value.trim().split('\n'), (str) => {
    const [left = '', right = ''] = str.split(/ *[,，] */);
    return {
      [keyF]: left.trim() || undefined,
      [valF]: right.trim() || undefined,
    };
  });
  return list;
}

</script>
<template>
  <div>
    <RadioGroup
      class="input-type"
      :value="inputType"
      :options="inputTypeOptions"
      @update:value="onChangeInputType"
    />
    <RTable v-if="inputType === 'single'"
      :columns="innerCols"
      :dataSource="dataSource"
      :pagination="pagination"
      size="small"
      rowKey="index"
      bordered
      disableCopy
      @change="onTableChange"
    />
    <template v-else>
      <div class="tips">
        {{tips}}
      </div>
      <ATextarea
        :value="batchValue"
        :rows="10"
        :placeholder="batchPlacehoder"
        @update:value="onUpdateBatchValue"
      />
    </template>
  </div>
</template>
<style scoped>
.input-type {
  margin: 5px 0 10px 0;
}
.tips {
  color: #666;
}
:deep(.ant-table-pagination) {
  margin: 5px 0 0 0;
}
</style>
