<script setup>
import {
  computed,
  onMounted,
  watch,
  ref,
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
  omit,
} from 'lodash-es';
import { message } from 'ant-design-vue';
import {
  QuestionCircleOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue';
import { useResizeObserver } from '@vueuse/core';
import newId from '@/uses/id';
import useCopyText from '@/uses/copy';
import Empty from '../empty';
import DataCell from './data-cell';
import SortIcon from './sort-icon';

const props = defineProps({
  columns: Array,
  dataSource: Array,
  disableCopy: Boolean,
  withIndexCol: Boolean,
  withCheckboxCol: Boolean,
  pagination: {},
  rowKey: String,
  sortConfig: Object,
  loading: Boolean,
  height: Number,
  selectedRowKeys: Array,
  rowProps: [Object, Function],
  rowClass: [Object, Function, String],
  bordered: Boolean,
});
const emit = defineEmits([
  'sort',
  'change',
  'pageChange',
  'rowSelectChange',
  'dblclickRow',
  'clickRow',
]);

const sortColIdxSet = new Set();
const colKey = 'key';
const id = `table_${newId()}`;

const exposeObj = shallowReactive({
  tableEl: undefined,
  tbody: undefined,
});

const wrapperSize = reactive({ w: 0, h: 0 });
const headerHeight = ref(50);
const tableRef = ref();
const sortState = reactive({});
const checkedRowSet = ref(new Set());
const innerColumns = shallowRef([]);
const innerPagination = reactive({
  current: 1,
  pageSize: 10,
});

const wrapperClass = computed(() => ({
  'is-empty': !unref(innerDataSource)?.length,
  bordered: props.bordered,
}));

const innerHeight = computed(() => {
  if (unref(innerDataSource)?.length) {
    return props.height || 450;
  }
  return 210;
});

const estimatedRowHeight = computed(() => {
  if (!unref(innerDataSource)?.length) {
    return 50;
  }
  const h = unref(innerHeight) / unref(innerDataSource).length;
  return h < 50 ? 50 : h;
});

const innerRowKey = computed(() => {
  return props.rowKey || Symbol('rowKey');
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
    return;
  }
  const conf = {
    current: 1,
    pageSize: 10,
    total: unref(props.dataSource)?.length || 0,
    showTotal: total => `总共 ${total < 0 ? 0 : total} 条`,
    showSizeChanger: true,
    size: 'small',
    class: 'ant-table-pagination justify-end',
  };
  if (props.pagination === undefined) {
    Object.assign(conf, innerPagination);
  } else {
    forEach(props.pagination, (v, k) => {
      if (v !== undefined) {
        conf[k] = v;
      }
    });
  }
  return conf;
});
const topPageVisible = computed(() => {
  if (!props.pagination?.position) {
    return false;
  }
  if (Array.isArray(props.pagination.position)) {
    return props.pagination.position.indexOf('topRight') !== -1;
  }
  return props.pagination.position === 'topRight';
});

const bottomPageVisible = computed(() => {
  if (!props.pagination?.position) {
    return true;
  }
  if (Array.isArray(props.pagination.position)) {
    return props.pagination.position.indexOf('bottomRight') !== -1;
  }
  return props.pagination.position === 'bottomRight';
});

const innerDataSource = computed(() => {
  const { current, pageSize } = unref(pageProps) || innerPagination;
  let data;
  if (unref(props.dataSource)?.length <= pageSize) {
    data = unref(props.dataSource);
  } else {
    const start = current * pageSize - pageSize;
    const end = current * pageSize;
    data = (unref(props.dataSource) || []).slice(start, end);
  }
  forEach(data, (item) => {
    if (item[unref(innerRowKey)]) {
      return;
    }
    Object.assign(item, { [unref(innerRowKey)]: newId() });
  });
  return data;
});

const allRowChecked = computed(() => {
  if (!unref(innerDataSource)?.length) {
    return false;
  }
  let all = true;
  forEach(unref(innerDataSource), (rowData) => {
    const dataKey = get(rowData, unref(innerRowKey));
    if (!unref(checkedRowSet).has(dataKey)) {
      all = false;
    }
    return all;
  });
  return all;
});

watch(() => [unref(props.columns), wrapperSize.w], (newVal, oldVal) => {
  // 长度发生变化
  if (oldVal && newVal && oldVal.length !== newVal.length) {
    sortColIdxSet.clear();
  }
  let addonCount = 0;
  const cols = [];
  const columns = [...(unref(props.columns) || [])];
  if (props.withIndexCol) {
    columns.unshift({
      key: '#seq#',
      type: 'seq',
      name: '序号',
      width: 45,
      align: 'center',
    });
    addonCount += 1;
  }
  if (props.withCheckboxCol) {
    columns.unshift({
      key: '#checkbox#',
      type: 'checkbox',
      width: 45,
      align: 'center',
    });
    addonCount += 1;
  }
  const wArr = [];
  const fixedW = {};
  forEach(columns, (colItem, index) => {
    const key = getColKey(colItem);
    cacheSortState({ colItem, index: index - addonCount, key });
    const item = { key, ...colItem };
    const width = Number.parseFloat(item.width);
    if (width) {
      item.width = width;
      wArr.push(width);
    } else {
      delete item.width;
    }
    if (item.isOperator) {
      Object.assign(item, { key: '#operators#', type: 'operators' });
    }
    if (isSpecialCol(item)) {
      fixedW[key] = 1;
    }
    cols.push(item);
  });
  const restWidth = wrapperSize.w - wArr.reduce((a, b) => (a + b), 0);
  if (wArr.length !== columns.length) {
    const colWidth = restWidth > 0
      ? restWidth / (columns.length - wArr.length)
      : 50;
    forEach(cols, (item) => {
      if (!item.width) {
        Object.assign(item, { width: colWidth });
      }
    });
  } else if (restWidth > 0) {
    const addonWidth = restWidth / (wArr.length - Object.keys(fixedW).length);
    forEach(cols, (item) => {
      if (!isSpecialCol(item)) {
        Object.assign(item, { width: item.width + addonWidth });
      }
    });
  }
  innerColumns.value = cols;
}, { immediate: true });

watch(() => props.selectedRowKeys, () => {
  checkedRowSet.value = new Set(props.selectedRowKeys);
}, { immediate: true, deep: true });

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

function onClickRowCheckbox(options = {}) {
  const { rowData } = options;
  const dataKey = get(options, `rowData.${unref(innerRowKey)}`);
  if (unref(checkedRowSet).has(dataKey)) {
    checkedRowSet.value.delete(dataKey);
  } else {
    checkedRowSet.value.add(dataKey);
  }
  emit('rowSelectChange', [...unref(checkedRowSet)]);
}

function onClickHeaderCheckbox(checked) {
  if (!checked) {
    checkedRowSet.value = new Set();
  } else {
    forEach(unref(innerDataSource), (rowData) => {
      const dataKey = get(rowData, unref(innerRowKey));
      unref(checkedRowSet).add(dataKey);
    });
  }
  emit('rowSelectChange', [...unref(checkedRowSet)]);
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
    if (item.isDelete && !item.popConfirmProps) {
      item.popConfirmProps = {
        title: '确认要删除吗？',
        placement: 'left',
      };
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

function getItem(options = {}) {
  const { column, record } = options;
  if (column?.type === 'operators') {
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

function getItemLength(options) {
  const item = getItem(options);
  return (Array.isArray(item))
    ? item.length
    : Object.keys(item || {}).length;
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
  return /^(seq|checkbox|operators)$/.test(colItem.type);
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
    if ((column?.component || cellData?.component) === 'ImgLink') {
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

function onPageChange(current, size) {
  const pagination = getPagination(current, size);
  emit('change', pagination);
  emit('pageChange', pagination);
}

function getPagination(current, size) {
  const { pageSize: oldSize } = unref(pageProps) || innerPagination;
  const pageSize = size || oldSize;
  if (props.pagination === undefined) {
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

function onResize(options = {}) {
  const { width: w, height: h } = options;
  Object.assign(wrapperSize, { w, h });
}

function getPopupContainer() {
  return unref(tableRef).$el;
}

function getRowClass(options = {}) {
  const dataKey = get(options.rowData, unref(innerRowKey));
  const className = {
    'is-checked': unref(checkedRowSet).has(dataKey),
  };

  if (typeof props.rowClass === 'function') {
    Object.assign(className, props.rowClass(options));
  } else if (typeof props.rowClass === 'string') {
    forEach(props.rowClass.split(' '), (str) => {
      className[str] = true;
    });
  } else if (typeof props.rowClass === 'object') {
    Object.assign(className, props.rowClass);
  }
  return className;
}

function getRowProps(options = {}) {
  let extra = props.rowProps || {};
  if (typeof props.rowProps === 'function') {
    extra = props.rowProps(options);
  }
  return {
    ...extra,
    onClick: (e) => {
      if (props.withCheckboxCol) {
        onClickRowCheckbox(options);
      }
      emit('clickRow', { e, ...options });
    },
    onDblclick: e => emit('dblclickRow', { e, ...options }),
  };
}

function onHeaderCellResize(entries) {
  forEach(entries, (entry) => {
    const scrollHeight = entry?.target?.scrollHeight || 0;
    resetHeaderHeight(scrollHeight);
  });
}

function resetHeaderHeight(scrollHeight) {
  if (scrollHeight > unref(headerHeight)) {
    headerHeight.value = scrollHeight + 5;
  }
}

onMounted(() => {
  const tableEl = unref(tableRef).$el;
  const headerStr = '.el-table-v2__main .el-table-v2__header > div';
  const theaderEl = tableEl.querySelector(headerStr);

  const ro = useResizeObserver(theaderEl, (entries) => {
    const [entry] = entries;
    if (entry && entry.target) {
      const cellEls = entry.target.querySelectorAll('.header-name');
      forEach(cellEls, (el) => {
        useResizeObserver(el, onHeaderCellResize);
        const scrollHeight = el?.scrollHeight || 0;
        resetHeaderHeight(scrollHeight);
      });
      ro.stop();
    }
  });
  const bodyStr = '.el-table-v2__main .el-table-v2__body > div > div';
  const tbodyEl = tableEl.querySelector(bodyStr);
  exposeObj.tbodyEl = tbodyEl;
  exposeObj.tableEl = tableEl;
});

defineExpose(exposeObj);

</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <div :class="$attrs.class">
  <ElAutoResizer
    class="my-table-wrapper p-relative"
    :class="wrapperClass"
    @resize="onResize"
  >
    <LoadingCover class="loading" :loading="loading" />
    <APagination v-if="topPageVisible && pageProps"
      v-bind="pageProps"
      @change="onPageChange"
    />
    <ElTableV2 ref="tableRef"
      :id="id"
      :data="innerDataSource"
      :columns="innerColumns"
      :maxHeight="innerHeight"
      :height="innerHeight"
      :width="wrapperSize.w"
      :estimated-row-height="estimatedRowHeight"
      :headerHeight="headerHeight"
      :rowKey="innerRowKey"
      :rowProps="getRowProps"
      :rowClass="getRowClass"
      fixed
      scrollbarAlwaysOn
      v-bind="omit($attrs, 'class')"
    >
      <template #empty>
        <Empty class="pt-10"/>
      </template>
      <template #header-cell="{ column, ...rest }">
        <span v-if="column?.htmlName"
          class="header-name height-100 align-center"
          v-html="column?.name || column?.title"
          @click="onClickHeader({ column, ...rest, e:$event })"
        />
        <span v-else
          class="header-name height-100 align-center break-all"
          :title="column?.title"
          @click="onClickHeader({ column, ...rest, e:$event })"
        >
          {{column?.name || column?.title}}
        </span>
        <ATooltip v-if="column?.tips"
          :title="column?.tips"
          :getPopupContainer="getPopupContainer"
        >
          <QuestionCircleOutlined class="ml-10" />
        </ATooltip>
        <template v-if="column?.sortable">
          <span class="height-100 align-center"
            @click="onClickHeader({ column, ...rest, e:$event })"
          >
            <SortIcon class="header-sort" :order="getOrder(column)" />
          </span>
          <span v-if="innerSortConf?.multiple && innerSortConf?.lockable"
            class="pl-5 header-lock height-100 align-center"
            @click.stop="onClickSortLock({ column, ...rest})"
          >
            <LockOutlined v-if="getOrderLock(column)" class="primary" />
            <UnlockOutlined v-else />
          </span>
        </template>
        <ACheckbox v-if="column?.type === 'checkbox'"
          :checked="allRowChecked"
          :indeterminate="!!checkedRowSet.size && !allRowChecked"
          @update:checked="onClickHeaderCheckbox"
        />
      </template>
      <template #cell="{ rowData: record, column, rowIndex: index, ...rest}">
        <slot v-if="column?.slot"
          :name="column?.slot"
          v-bind="{ record, column, index, ...rest }"
        />
        <template v-else-if="column?.type === 'checkbox'">
          <ACheckbox
            :checked="checkedRowSet.has(record?.[unref(innerRowKey)])"
          />
        </template>
        <template v-else-if="column?.type === 'seq'">
          {{getPageSeq(index)}}
        </template>
        <span v-else
          :class="{ operators: column?.type === 'operators' }"
        >
          <template v-for="(item, key) in getItem({ column, record })"
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
                :itemLength="getItemLength({ column, record })"
                inConfirm
              />
            </APopconfirm>
            <DataCell v-else
              :column="column"
              :record="record"
              :index="index"
              :item="item"
              :itemKey="key"
              :itemLength="getItemLength({ column, record })"
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
    </ElTableV2>
    <APagination v-if="bottomPageVisible && pageProps"
      v-bind="pageProps"
      @change="onPageChange"
    />
  </ElAutoResizer>
  </div>
</template>
<style scoped>
.my-table-wrapper {
  :deep(.el-table-v2__empty) {
  }
  :deep(.el-table-v2__root) {
    border: 1px solid #f0f0f0;
    overflow: hidden;
  }

  :deep(.el-table-v2__right),
  :deep(.el-table-v2__left) {
    border-top: 1px solid #f0f0f0;
  }

  :deep(.el-table-v2__right) {
    top: -1px;
    right: -7.5px;
  }

  &:not(.is-empty) {
    :deep(.el-table-v2__right),
    :deep(.el-table-v2__left) {
      border-bottom: 1px solid #f0f0f0;
    }

  }

  &.is-empty {
    :deep(.el-table-v2__main .el-table-v2__body) {
      height: 144px;
    }
  }

  &.bordered {
    :deep(.el-table-v2__row-cell),
    :deep(.el-table-v2__header-cell) {
      border-right: 1px solid #f0f0f0;
    }
  }

  &:not(.bordered) {
    :deep(.el-table-v2__header-cell) {
      &:not(:last-child):before {
        position: absolute;
        top: 50%;
        right: 0;
        width: 1px;
        height: 1.6em;
        background-color: rgba(0, 0, 0, 0.06);
        transform: translateY(-50%);
        transition: background-color 0.3s;
        content: '';
      }
    }
  }

  :deep(.el-table-v2__header-cell) {
    color: var(--font-color);
    font-weight: 600;
    position: relative;
    background: #fafafa;

    &.is-sortable {
      display: flex;

      &:hover {
        cursor: pointer;
        .header-sort, .header-lock {
          color: var(--primary-color);
        }
      }
      .header-name {
        flex-grow: 1;
      }

      .el-table-v2__sort-icon {
        display: none;
      }
    }

    .header-name {
      overflow-y: auto;
    }
  }

  :deep(.el-table-v2__row) {
    &.is-checked {
      background-color: #e6f7ff;
      &.is-hovered {
        background-color: #dcf4ff;
      }
    }
  }

  :deep(.el-table-v2__row-cell) {
    position: relative;
    padding: 8px;

    &:hover .copy-tag {
      display: unset;
    }
  }


  &:deep(.ant-btn-link) {
    padding: 0 2px;
    height: unset;
    line-height: 1;
  }

  :deep(.ant-tag) {
    margin-right: 5px;
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

  .loading {
    background: rgba(255, 255, 255, .5);
  }

  .copy-tag {
    display: none;
    right: -2px;
    top: 2px;
  }

  .ant-table-pagination {
    margin: 0;
    padding: 10px 0;
  }
}

</style>
