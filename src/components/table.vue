<script setup>
import {
  computed,
  onMounted,
} from 'vue';
import {
  get,
  set,
  map,
  forEach,
  isEmpty,
  cloneDeep,
} from 'lodash-es';
import {
  HolderOutlined,
} from '@ant-design/icons-vue';
import sortable from 'sortablejs';
import newId from '@/uses/id';

const props = defineProps({
  columns: Array,
  dragable: Boolean,
});
const emit = defineEmits([
  'dragEnd',
]);

const id = `table_${newId()}`;

const innerColumns = computed(() => {
  const cols = map(props.columns, (item) => {
    const col = {
      onClick: () => {},
      'onUpdate:value': () => {},
      compProps: {},
      customHeaderCell() {
        return {
          title: item.title,
          onClick: () => onClickCol(item),
        };
      },
      ...item,
    };
    return col;
  });
  if (props.dragable) {
    cols.unshift({ isDrag: true, width: '60px' });
  }
  return cols;
});

function getItem({ column, record } = {}) {
  const item = get(record, column.dataIndex);
  if (!item) {
    return;
  }
  if (!Array.isArray(item)) {
    return [item];
  }
  return item;
}

function onCompClick({
  e, column, record, item, index,
}) {
  if (item.onClick) {
    return item.onClick({
      e, column, record, item, index,
    });
  }
  if (column.onClick) {
    return column.onClick({
      e, column, record, item, index,
    });
  }
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
    const {
      isDelete, popConfirmProps, onClick, onConfirm,
    } = opItem;
    if (isDelete && !popConfirmProps) {
      conf[key].popConfirmProps = {
        title: '确认要删除吗？',
      };
      if (onClick && !onConfirm) {
        conf[key].onConfirm = onClick;
        conf[key].onClick = () => {};
      }
    }
  });
  return conf;
}

function onClickCol() {
  // TODO: 自定义排序
}

onMounted(() => {
  const tbody = document.querySelector(`#${id} tbody.ant-table-tbody`);
  sortable.create(tbody, {
    animation: 100,
    handle: '.drag-holder',
    onEnd: (e) => emit('dragEnd', e),
  });
});

</script>
<template>
  <ATable
    :id="id"
    size="small"
    :columns="innerColumns"
    :sortDirections="['descend', 'ascend']"
    :showSorterTooltip="false"
  >
    <template v-for="(n, slotName) of $slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName"
        v-bind="{ ...slotProps }"
      />
    </template>
    <template #headerCell="{ column }">
      {{column.name || column.title}}
    </template>
    <template #bodyCell="{ column, record, index, ...rest }">
      <slot v-if="column.slot"
        :name="column.slot"
        v-bind="{ column, record, index, ...rest }"
      />
      <template v-else-if="column.isOperator">
        <div v-bind="column.compProps">
          <template v-for="(item, key) in getOp({ column, record})"
            :key="key"
          >
            <APopconfirm v-if="item.popConfirmProps"
              v-bind="item.popConfirmProps"
              @confirm="item.onConfirm({ column, record, index, item, key })"
            >
              <component
                :is="item.component"
                v-bind="item.compProps"
                @click="item.onClick({ column, record, index, item, key })"
              >
                {{item.text}}
              </component>
            </APopconfirm>
            <component v-else
              :is="item.component"
              v-bind="item.compProps"
              @click="item.onClick({ column, record, index, item, key })"
            >
              {{item.text}}
            </component>
          </template>
        </div>
      </template>
      <template v-else-if="column.isDrag">
        <HolderOutlined class="drag-holder" />
      </template>
      <template v-else-if="getItem({ column, record })">
        <template v-for="(item, index) in getItem({ column, record })"
          :key="item.text || item"
        >
          <component v-if="item.component || column.component"
            :is="item.component || column.component"
            v-bind="{ ...column.compProps, ...item.compProps }"
            @click="e => onCompClick({ e, column, record, item, index })"
            @update:value="value =>
              column['onUpdate:value']({ value, column, record, item, index })"
          >
            {{item.text !== undefined ? item.text : item}}
          </component>
          <template v-else>
            {{item.text !== undefined ? item.text : item}}
          </template>
        </template>
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

.tag-button {
  cursor: pointer;
  width: fit-content;
  margin-bottom: 5px;
}

.drag-holder {
  width: 40px;
  height: 30px;
  line-height: 34px;
  cursor: move;
}

</style>
