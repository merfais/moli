<script setup>
import {
  computed,
  onMounted,
  watch,
  unref,
  shallowRef,
  shallowReactive,
} from 'vue';
import {
  get,
  set,
  map,
  forEach,
  isEmpty,
  cloneDeep,
  has,
} from 'lodash-es';
import { message } from 'ant-design-vue';
import {
  HolderOutlined,
  QuestionCircleOutlined,
  SwapOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue';
import sortable from 'sortablejs';
import newId from '@/uses/id';
import useCopyText from '@/uses/copy';
import DataCell from './data-cell';
import OpBtnCell from './op-btn-cell';

const props = defineProps({
  columns: Array,
  dragable: Boolean,
  disableCopy: Boolean,
  enableMultiSort: Boolean,
  enableMultiSortLock: Boolean,
  withIndexCol: Boolean,
  pagination: {},
});
const emit = defineEmits([
  'dragEnd',
  'sort',
  'change',
]);

const id = `table_${newId()}`;
const exposeObj = shallowReactive({
  id,
  tableEl: undefined,
});
const sortState = shallowRef({});
const sortColIdxSet = new Set();
const pageConf = shallowReactive({
  pageSize: get(props, 'pagination.pageSize'),
  current: get(props, 'pagination.current'),
});

const innerPagination = computed(() => {
  if (typeof props.pagination === 'boolean') {
    return props.pagination;
  }
  return {
    showTotal: total => `总共 ${total} 条`,
    ...props.pagination,
  };
});

const page = computed(() => {
  const { pageSize, current = 1 } = pageConf || {};
  const size = pageSize || 10;
  let index = current - 1;
  if (index < 0) {
    index = 0;
  }
  return { size, index };
});

const innerColumns = computed(() => {
  const cols = [];
  forEach(props.columns, (colItem) => {
    if (colItem.notVisible) {
      return;
    }
    const col = {
      onClick: () => {},
      'onUpdate:value': () => {},
      compProps: {},
      ...colItem,
      sortKey: getSortKey(colItem),
    };
    cols.push(col);
  });
  if (props.withIndexCol) {
    cols.unshift({ isIndex: true, name: '序号', width: 45, align: 'center' });
  }
  if (props.dragable) {
    cols.unshift({ isDrag: true, width: 40 });
  }
  return cols;
});

watch(() => props.columns, (newVal, oldVal) => {
  // 长度发生变化
  if (oldVal && newVal && oldVal.length !== newVal.length) {
    sortColIdxSet.clear();
  }
  const state = {};
  forEach(props.columns, (colItem, index) => {
    const { order, orderLock } = colItem;
    const sortKey = getSortKey(colItem);
    state[sortKey] = { order, orderLock, index };
    if (!order) {
      sortColIdxSet.delete(index);
    } else {
      sortColIdxSet.add(index);
    }
  });
  sortState.value = state;
}, { immediate: true });

function getSortKey(colItem) {
  const { dataIndex, key } = colItem;
  if (key) {
    return key;
  }
  return Array.isArray(dataIndex) ? dataIndex.join('/') : dataIndex;
}

function getOrder(colItem) {
  const { sortKey } = colItem;
  return get(unref(sortState), [sortKey, 'order']);
}

function getOrderLock(colItem) {
  const { sortKey } = colItem;
  return get(unref(sortState), [sortKey, 'orderLock']);
}

function getDisplayRaw({ column, record } = {}) {
  if (column.displayRaw) {
    return true;
  }
  const item = get(record, column.dataIndex);
  if (item?.displayRaw) {
    return true;
  }
}

function getItem({ column, record } = {}) {
  const item = get(record, column.dataIndex);
  if (item === undefined) {
    return;
  }
  if (!Array.isArray(item)) {
    return [item];
  }
  return item;
}

function getOp({ column, record } = {}) {
  const item = get(record, column.dataIndex);
  let { ops } = column;
  if (typeof item === 'function') {
    const columnCloned = cloneDeep(column);
    ops = item(columnCloned);
    if (ops === undefined) {
      ops = columnCloned.ops;
    }
  } else if (!isEmpty(item)) {
    ops = item;
  }
  const conf = {};
  forEach(ops, (opItem, key) => {
    conf[key] = {
      component: 'AButton',
      onClick: () => {},
      ...opItem,
    };
    if (conf[key].component === 'AButton'
      && get(opItem, 'compProps.type') === undefined
    ) {
      set(conf[key], 'compProps.type', 'link');
    }
    const { isDelete, popConfirmProps, onClick, onConfirm } = opItem;
    if (isDelete && !popConfirmProps) {
      conf[key].popConfirmProps = {
        title: '确认要删除吗？',
      };
    }
    // 使用了popconfirm，提供了onclick但为提供onConfirm，调整下
    if (conf[key].popConfirmProps && onClick && !onConfirm) {
      conf[key].onConfirm = onClick;
      conf[key].onClick = () => {};
    }
  });
  return conf;
}

function onClickColumn(options = {}) {
  const { enableSort, sortKey } = options.column || {};
  if (!enableSort) {
    return;
  }
  const sortConf = { ...get(unref(sortState), sortKey) };
  const order = sortConf.order === 'desc' ? 'asc' : 'desc';

  // 重置sortState中的order值
  const state = cloneDeep(unref(sortState));
  if (!props.enableMultiSort && !props.enableMultiSortLock) {
    forEach(state, (item, key) => {
      state[key] = { ...item, order: undefined };
    });
    // 不支持多列排序，清空set
    sortColIdxSet.clear();
  } else if (props.enableMultiSortLock) {
    forEach(state, (item, key) => {
      const order = item.orderLock ? item.order : undefined;
      state[key] = { ...item, order };
      // 未锁定排序，删除set中的index
      if (!order) {
        sortColIdxSet.delete(item.index);
      }
    });
  }
  set(state, [sortKey, 'order'], order);
  sortState.value = state;

  // 先删除在添加，可将最后点击排序的列移动到最后一位
  sortColIdxSet.delete(sortConf.index);
  sortColIdxSet.add(sortConf.index);

  const columns = map(unref(props.columns), (colItem) => {
    const sortKey = getSortKey(colItem);
    const { order, orderLock } = get(unref(sortState), sortKey) || {};
    return {
      ...colItem,
      order,
      orderLock,
    };
  });

  emit('sort', {
    ...sortConf,
    column: columns[sortConf.index],
    order,
    columns,
    sortColIdxs: [...sortColIdxSet],
  });
}

function onClickSortLock(options = {}) {
  const { enableSort, sortKey } = options.column || {};
  if (!enableSort) {
    return;
  }

  const state = cloneDeep(unref(sortState));
  const orderLock = !get(state, [sortKey, 'orderLock']);
  set(state, [sortKey, 'orderLock'], orderLock);
  sortState.value = state;
}

function getCellText({ column, record } = {}) {
  const { metaIndex, dataIndex, key } = column;
  if (has(column, 'metaIndex') && has(record, metaIndex)) {
    return record[metaIndex];
  }
  const value = record[dataIndex || key];
  if (Array.isArray(value)) {
    return map(value, (item) => {
      return has(item, 'text') ? item.text : item;
    }).join();
  }
  return has(value, 'text') ? value.text : value;
}

function onClickCopy(options) {
  const text = getCellText(options);
  useCopyText(text);
  message.success('复制成功');
}

function onTableChange(...args) {
  Object.assign(pageConf, args[0]);
  emit('change', ...args);
}

function getPopupContainer() {
  return document.querySelector(`#${id}`);
}

onMounted(() => {
  const tbody = document.querySelector(`#${id} tbody.ant-table-tbody`);
  sortable.create(tbody, {
    animation: 100,
    handle: '.drag-holder',
    onEnd: e => emit('dragEnd', e),
  });
  exposeObj.tbodyEl = tbody;
});

defineExpose(exposeObj);

</script>
<template>
  <ATable
    :id="id"
    size="small"
    :columns="innerColumns"
    :sortDirections="['descend', 'ascend']"
    :showSorterTooltip="false"
    :pagination="innerPagination"
    @change="onTableChange"
  >
    <template v-for="(n, slotName) of $slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName"
        v-bind="{ ...slotProps }"
      />
    </template>
    <template #headerCell="{ column, ...rest }">
      <div class="header-cell-wrapper flex-center c-pointer"
        :title="column.title"
        @click="onClickColumn({ column, ...rest })"
      >
        <div class="flex-grow">
          <span v-if="column.htmlName"
            v-html="column.name || column.title"
          />
          <template v-else>{{column.name || column.title}}</template>
          <ATooltip v-if="column.tips"
            :title="column.tips"
            :getPopupContainer="getPopupContainer"
          >
            <QuestionCircleOutlined class="ml-10" />
          </ATooltip>
        </div>
        <div v-if="column.enableSort" class='sort-icon'>
          <SortDescIcon v-if="getOrder(column) === 'desc'" class="primary" />
          <SortAscIcon v-else-if="getOrder(column) === 'asc'" class="primary" />
          <SwapOutlined v-else class="rotate-90" />
          <span v-if="enableMultiSortLock"
            class="pl-10"
            @click.stop="onClickSortLock({ column, ...rest})"
          >
            <LockOutlined v-if="getOrderLock(column)" class="primary" />
            <UnlockOutlined v-else />
          </span>
        </div>
      </div>
    </template>
    <template #bodyCell="{ column, record, index, ...rest }">
      <slot v-if="column.slot"
        :name="column.slot"
        v-bind="{ column, record, index, ...rest }"
      />
      <template v-else-if="column.isDrag">
        <HolderOutlined class="drag-holder" />
      </template>
      <template v-else-if="column.isIndex">
        <span class="index-cell">
          {{(page.index * page.size) + index + 1}}
        </span>
      </template>
      <template v-else-if="column.isOperator">
        <div v-bind="column.compProps">
          <template v-for="(item, key) in getOp({ column, record})"
            :key="key"
          >
          <OpBtnCell
            :column="column"
            :record="record"
            :index="index"
            :item="item"
            :dataKey="key"
            :getPopupContainer="getPopupContainer"
          />
          </template>
        </div>
      </template>
      <template v-else-if="getDisplayRaw({ column, record})">
        <DataCell
          displayRaw
          :column="column"
          :record="record"
          :index="0"
          :item="get(record, column.dataIndex)"
          :getPopupContainer="getPopupContainer"
        />
      </template>
      <template v-else-if="getItem({ column, record })">
        <template v-for="(item, index) in getItem({ column, record })"
          :key="item.text || item"
        >
          <DataCell
            :column="column"
            :record="record"
            :index="index"
            :item="item"
            :getPopupContainer="getPopupContainer"
          />
        </template>
        <ATag v-if="!disableCopy && !column.disableCopy"
          class="copy-tag c-pointer ml-5"
          color="green"
          @click="onClickCopy({ column, record })"
        >
          复制
        </ATag>
      </template>
      <template v-else-if="column.dftVal">
        {{column.dftVal}}
      </template>
    </template>
  </ATable>
</template>
<style scoped>
:deep(.ant-table-container) {
  border: 1px solid #f0f0f0;

  .ant-table-thead,
  .ant-table-tbody,
  .ant-table-row {
    width: 100%;
  }

  .ant-table-thead {
    .ant-table-cell {
      padding: 0;
    }
    .ant-table-filter-trigger {
      margin: 0;
    }
  }

  .ant-table-tbody > tr > td {
    position: relative;

    &:hover > .copy-tag {
      display: unset;
    }
  }

  .ant-btn-link {
    padding: 0 2px;
    height: unset;
    line-height: 1;
  }

  .ant-tag {
    margin-right: 5px;
  }

  .sortable-chosen {
    .ant-table-cell-row-hover {
      background: unset;
    }
  }
}

:deep(.ant-popconfirm) {
  .ant-popover-buttons {
    min-width: 130px;
    & > button {
      margin-left: 0;
    }

    & > button + button {
      margin-left: 8px;
    }
  }
}

.header-cell-wrapper {
  padding: 8px;

  &:hover {
    .sort-icon {
      color: var(--light-primary-color);
    }
  }

  .sort-icon {
    padding: 3px 5px;
    margin-right: -8px;
  }
}

.tag-button {
  cursor: pointer;
  width: fit-content;
  margin-bottom: 5px;
}

.drag-holder {
  width: 24px;
  height: 30px;
  line-height: 34px;
  cursor: move;
}

.index-cell {
  min-width: 20px;
  width: fit-content;
  text-align: center;
  display: block;
}

.copy-tag {
  display: none;
  position: absolute;
  right: -2px;
  top: 2px;
}

</style>
