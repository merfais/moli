<script setup>
import {
  computed,
  onMounted,
  watch,
  unref,
  shallowRef,
  shallowReactive,
  reactive,
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
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue';
import sortable from 'sortablejs';
import newId from '@/uses/id';
import useCopyText from '@/uses/copy';
import DataCell from './data-cell';
import SortIcon from './sort-icon';

const props = defineProps({
  columns: Array,
  dragable: Boolean,
  disableCopy: Boolean,
  withIndexCol: Boolean,
  pagination: {},
  sortConfig: Object,
});
const emit = defineEmits([
  'dragEnd',
  'sort',
  'change',
  'pageChange',
]);

const sortColIdxSet = new Set();
const colKey = 'key';
const id = `table_${newId()}`;

const exposeObj = shallowReactive({
  id,
  tableEl: undefined,
  tbody: undefined,
});

const sortState = reactive({});
// const innerPagination = ref();
const innerColumns = shallowRef([]);
const innerPagination = reactive({
  current: 1,
  pageSize: 10,
});

const innerSortConf = computed(() => {
  return {
    multiple: false,
    lockable: false,
    orders: ['desc', 'asc', 'null'],
    ...props.sortConfig,
  };
});

const pageProps = computed(() => {
  if (props.pagination === false) {
    return false;
  }
  const conf = {
    current: 1,
    pageSize: 10,
    total: props.dataSource?.length || 0,
    showSizeChanger: true,
    showTotal: (totalNum) => {
      let { total } = props.pagination || {};
      if (total && typeof total === 'string') {
        return `总共 ${total} 条`;
      }
      if (typeof totalNum === 'number') {
        total = totalNum < 0 ? 0 : totalNum;
      }
      return `总共 ${total} 条`;
    },
  };

  if (!has(props.pagination, 'current')
    && !has(props.pagination, 'pageSize')
    && !has(props.pagination, 'total')
  ) {
    Object.assign(conf, innerPagination);
  }
  if (props.pagination) {
    forEach(props.pagination, (v, k) => {
      if (v !== undefined) {
        conf[k] = v;
      }
    });
  }
  if (typeof conf.total === 'string') {
    conf.total = Number.parseInt(conf.total, 10);
  }
  return conf;
});

watch(() => props.columns, (newVal, oldVal) => {
  // 长度发生变化
  if (oldVal && newVal && oldVal.length !== newVal.length) {
    sortColIdxSet.clear();
  }
  let addonCount = 0;
  const cols = [];
  const columns = [...(unref(props.columns) || [])];
  if (props.withIndexCol) {
    columns.unshift({
      isSeq: true,
      key: '#seq#',
      name: '序号',
      width: 45,
      align: 'center',
    });
    addonCount += 1;
  }
  if (props.dragable) {
    columns.unshift({
      isDrag: true,
      key: '#drag#',
      width: 40,
    });
    addonCount += 1;
  }
  forEach(columns, (colItem, index) => {
    if (colItem.notVisible) {
      return;
    }
    const key = getColKey(colItem);
    cacheSortState({ colItem, index: index - addonCount, key });

    const item = {
      key,
      onClick: () => {},
      'onUpdate:value': () => {},
      compProps: {},
      ...colItem,
    };

    if (item.isOperator) {
      Object.assign(item, { key: '#operators#' });
    }
    cols.push(item);
  });
  innerColumns.value = cols;
}, { immediate: true });

function getColKey(colItem) {
  const { dataIndex, key } = colItem;
  if (key) {
    return key;
  }
  return Array.isArray(dataIndex) ? dataIndex.join('/') : dataIndex;
}

function cacheSortState({ colItem, index, key } = {}) {
  const { order, locked } = colItem || {};
  if (order !== undefined) {
    set(sortState, [key, 'order'], order);
  }
  if (locked !== undefined) {
    set(sortState, [key, 'locked'], locked);
  }
  set(sortState, [key, 'index'], index);
  if (!order) {
    sortColIdxSet.delete(index);
  } else {
    sortColIdxSet.add(index);
  }
}
function getOrder(colItem) {
  return get(sortState, [get(colItem, colKey), 'order']);
}

function getOrderLock(colItem) {
  return get(sortState, [get(colItem, colKey), 'locked']);
}

function onClickHeader(options = {}) {
  const { sortable } = options.column || {};
  if (sortable) {
    onSortChange(options);
  }
}

/**
 * 点击表头排序
 */
function onSortChange(options = {}) {
  const key = get(options.column, colKey);
  if (!key) {
    return;
  }
  const old = { ...get(sortState, key) };

  const { multiple, lockable } = unref(innerSortConf) || {};
  // 重置sortState中的order值
  if (!multiple) {
    // 非多列排序， 清空所有列的order状态
    forEach(sortState, (item, iKey) => {
      sortState[iKey] = { ...item, order: undefined };
    });
    // 不支持多列排序，清空set
    sortColIdxSet.clear();
  } else if (lockable) {
    forEach(sortState, (item, iKey) => {
      // 保留锁定排序的order状态
      const order = item.locked ? item.order : undefined;
      sortState[iKey] = { ...item, order };
      // 未锁定排序，删除set中的index
      if (!order) {
        sortColIdxSet.delete(item.index);
      }
    });
  }

  const { orders } = unref(innerSortConf);
  const index = (orders.indexOf(old.order) + 1) % orders.length;
  const order = orders[index] === 'null' ? undefined : orders[index];
  set(sortState, [key, 'order'], order);

  // 先删除在添加，可将最后点击排序的列移动到最后一位
  sortColIdxSet.delete(old.index);
  sortColIdxSet.add(old.index);

  const columns = map(unref(props.columns), (colItem) => {
    const key = getColKey(colItem);
    const { order, locked } = get(sortState, key) || {};
    return {
      ...colItem,
      order,
      locked,
    };
  });
  const payload = {
    ...old,
    column: columns[old.index],
    order,
    columns,
    sortColIdxs: [...sortColIdxSet],
  };

  const pagination = getPagination(1);
  emit('sort', payload);
  emit('change', pagination, undefined, payload);
}

function onClickSortLock(options = {}) {
  const { sortable } = options.column || {};
  if (!sortable) {
    return;
  }

  const key = get(options.column, colKey);
  const locked = !get(sortState, [key, 'locked']);
  set(sortState, [key, 'locked'], locked);
}

function getItem(options = {}) {
  const { column, record } = options;
  if (column?.isOperator) {
    return getOp({ column, record });
  }
  let cellData = get(record, column?.dataIndex);
  if (cellData === undefined) {
    cellData = column?.dftVal;
  }
  if (!Array.isArray(cellData)) {
    return [cellData];
  }
  return cellData;
}

function getPopConfirmProps({ column, item } = {}) {
  const tmp = {
    ...column?.popConfirmProps,
    ...item?.popConfirmProps,
  };
  return isEmpty(tmp) ? undefined : tmp;
}

function enableCopy(column = {}) {
  if (props.disableCopy) {
    return false;
  }
  const { disableCopy, component } = column;
  if (disableCopy || isSpecialCol(column)) {
    return false;
  }
  if (component) {
    if (/^(a|r)-?(input(-?(search|number))?|textarea)$/i.test(component)) {
      return false;
    }
    if (/^(a|r)-?(select|cascader|button|checkbox|radio)$/i.test(component)) {
      return false;
    }
  }
  return true;
}

function isSpecialCol(colItem) {
  return colItem.isOperator || colItem.isDrag || colItem.isSeq;
}

function getOp({ column, record } = {}) {
  const item = get(record, column?.dataIndex);
  let { ops } = column || {};
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
    const item = {
      component: 'AButton',
      onClick: () => {},
      ...opItem,
    };
    set(item, 'compProps.class', 'is-op');
    // 设置按钮默认使用link形态
    if (item.component === 'AButton'
      && get(item, 'compProps.type') === undefined
    ) {
      set(item, 'compProps.type', 'link');
    }
    // 如果是删除按钮，设置删除确认参数
    if (item.isDelete) {
      if (!item.popConfirmProps) {
        item.popConfirmProps = {
          title: '确认要删除吗？',
          placement: 'left',
        };
      }
      set(item, 'compProps.danger', true);
    }
    const { popConfirmProps, onClick, onConfirm } = item;
    if (popConfirmProps) {
      // 设置默认位置
      popConfirmProps.placement = popConfirmProps.placement || 'left';
      // 使用了popconfirm，提供了onclick但为提供onConfirm，调整下
      if (onClick && !onConfirm) {
        item.onConfirm = onClick;
        item.onClick = () => {};
      }
    }
    conf[key] = item;
  });
  return conf;
}

function onClickCopy(options) {
  const text = getCellText(options);
  useCopyText(text);
  message.success('复制成功');
}

function getCellText({ column, record } = {}) {
  const { metaIndex, dataIndex, key } = column;
  if (has(column, 'metaIndex') && has(record, metaIndex)) {
    return record[metaIndex];
  }

  function getText(cellData) {
    if ((column?.component || cellData.component) === 'ImgLink') {
      return get(cellData, 'compProps.href');
    }
    return has(cellData, 'text') ? cellData.text : cellData;
  }

  const value = get(record, dataIndex || key);
  if (Array.isArray(value)) {
    return map(value, val => getText(val)).join();
  }
  return getText(value);
}

function onClickConfirm(options = {}) {
  const { item, column, ...rest } = options;
  const onConfirm = column?.onConfirm || item?.onConfirm;
  if (typeof onConfirm !== 'function') {
    return;
  }
  onConfirm({
    item,
    column,
    ...rest,
  });
}

function onTableChange(newPagination, ...args) {
  const { current, pageSize } = newPagination || {};
  const pagination = getPagination(current, pageSize);
  emit('change', pagination, ...args);
  emit('pageChange', pagination);
}

function getPagination(current, size) {
  const { pageSize: oldSize } = unref(pageProps) || innerPagination;
  const pageSize = size || oldSize;
  if (!has(props.pagination, 'current')
    && !has(props.pagination, 'pageSize')
    && !has(props.pagination, 'total')
  ) {
    Object.assign(innerPagination, { current, pageSize });
    return innerPagination;
  }
  return {
    ...props.pagination,
    current,
    pageSize,
  };
}

function getPageSeq(index) {
  const { current, pageSize } = unref(pageProps) || innerPagination;
  return (current - 1) * pageSize + index + 1;
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
    :pagination="pageProps"
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
        :title="column?.title"
        @click="onClickHeader({ column, ...rest })"
      >
        <div class="flex-grow">
          <span v-if="column?.htmlName"
            v-html="column?.name || column?.title"
          />
          <template v-else>
            {{column?.name || column?.title}}
          </template>
          <ATooltip v-if="column?.tips"
            :title="column.tips"
            :getPopupContainer="getPopupContainer"
          >
            <QuestionCircleOutlined class="ml-10" />
          </ATooltip>
        </div>
        <div v-if="column?.sortable" class='sort-icon'>
          <SortIcon class="header-sort" :order="getOrder(column)" />
          <span v-if="innerSortConf?.multiple && innerSortConf?.lockable"
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
      <slot v-if="column?.slot"
        :name="column.slot"
        v-bind="{ column, record, index, ...rest }"
      />
      <template v-else-if="column?.isDrag">
        <HolderOutlined class="drag-holder flex-center" />
      </template>
      <template v-else-if="column?.isSeq">
        <span class="index-cell">
          {{getPageSeq(index)}}
        </span>
      </template>
      <span v-else
        :class="{ operators: column?.isOperator }"
      >
        <template v-for="(item, key) in getItem({ column, record, rest })"
          :key="key"
        >
          <APopconfirm v-if="getPopConfirmProps({ column, item })"
            v-bind="getPopConfirmProps({ column, item })"
            :getPopupContainer="getPopupContainer"
            @confirm="e => onClickConfirm({ e, column, record, item, key, index })"
          >
            <DataCell
              :column="column"
              :record="record"
              :index="index"
              :item="item"
              :itemKey="key"
              inConfirm
            />
          </APopconfirm>
          <DataCell v-else
            :column="column"
            :record="record"
            :index="index"
            :item="item"
            :itemKey="key"
          />
        </template>
        <ATag v-if="enableCopy(column)"
          class="copy-tag c-pointer p-absolute"
          color="green"
          @click.stop="onClickCopy({ column, record })"
        >
          复制
        </ATag>
      </span>
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

    &:hover .copy-tag {
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
  height: 22px;
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
