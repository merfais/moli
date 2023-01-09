<script setup>
import {
  ref,
  unref,
  reactive,
  shallowReactive,
  watch,
  computed,
} from 'vue';
import {
  get,
  forEach,
} from 'lodash-es';

const props = defineProps({
  columns: Array,
  dataSource: Array,
  pagination: {
    type: Object,
    default: () => ({
      current: 1,
      pageSize: 10,
      hideOnSinglePage: true,
    }),
  },
  logList: Array,
  visible: Boolean,
  versionKey: {
    type: String,
    default: 'update_version',
  },
});

const emit = defineEmits([
  'update:visible',
  'restore',
]);

let selectedRowIndex = 0;
const drawer = reactive({
  width: '1000px',
  rowItem: {},
});

const logInfo = shallowReactive({
  left: '{}',
  right: '{}',
  lTitle: '',
  rTitle: '',
});

const tableRef = ref();

const innerColumns = computed(() => {
  return [
    ...props.columns,
    {
      name: '',
      dataIndex: 'ops',
      isOperator: true,
      ops: {
        restore: {
          text: '恢复',
          onClick: (options) => {
            emit('update:visible', false);
            emit('restore', options);
          },
        },
      },
    },
  ];
});

watch(() => props.visible, () => {
  if (!props.visible) {
    drawer.width = '1000px';
  }
});

watch(() => props.dataSource, () => {
  selectedRowIndex = 0;
  genLogInfo();
}, { immediate: true });

function onClickFullscreen() {
  if (drawer.width !== '100%') {
    drawer.width = '100%';
  } else {
    drawer.width = '1000px';
  }
}

function genLogInfo() {
  const rightIndex = selectedRowIndex;
  const leftIndex = Number(selectedRowIndex) + 1;
  const left = get(props.logList, leftIndex, {});
  const right = get(props.logList, rightIndex, {});
  Object.assign(logInfo, {
    left: JSON.stringify(left, null, 2),
    right: JSON.stringify(right, null, 2),
    lTitle: get(props.dataSource, `[${leftIndex}].${props.versionKey}`),
    rTitle: get(props.dataSource, `[${rightIndex}].${props.versionKey}`),
  });
}

function customRow(record, index) {
  return {
    class: {
      'c-pointer': true,
      'row-selected': index === selectedRowIndex,
      'row-selected-next': index === (selectedRowIndex + 1),
    },
    onClick: () => {
      onClickRow(index);
    },
  };
}

function onClickRow(activeIndex) {
  selectedRowIndex = activeIndex;
  const { tbodyEl } = unref(tableRef) || {};
  forEach(tbodyEl.children, (item) => {
    item.classList.remove('row-selected', 'row-selected-next');
  });
  forEach(tbodyEl.children, (item, index) => {
    if (index === activeIndex) {
      item.classList.add('row-selected');
      if (tbodyEl.children[index + 1]) {
        tbodyEl.children[index + 1].classList.add('row-selected-next');
      }
    }
  });
  genLogInfo();
}

</script>
<template>
  <ADrawer
    destroyOnClose
    :visible="visible"
    title="变更日志"
    :width="drawer.width"
    @update:visible="$emit('update:visible', $event)"
  >
    <template #extra>
      <RButton @click="onClickFullscreen">
        <ExitFullscreenIcon v-if="drawer.width === '100%'"/>
        <FullscreenIcon v-else />
      </RButton>
    </template>
    <div class="height-100 d-flex">
      <div class="flex-0-0 log-table height-100 pr-10">
        <RTable
          ref="tableRef"
          disableCopy
          :columns="innerColumns"
          :dataSource="dataSource"
          :customRow="customRow"
          :pagination="pagination"
        />
      </div>
      <div class="flex-grow flex-column">
        <div class="title d-flex">
          <div class="width-50 left pl-5">版本：{{logInfo.lTitle}}</div>
          <div class="width-50 right pl-5">版本：{{logInfo.rTitle}}</div>
        </div>
        <div class="flex-grow viewer-wrapper">
          <DiffViewer
            :value="logInfo"
          />
        </div>
      </div>
    </div>
  </ADrawer>
</template>
<style scoped>
:deep(.ant-table-content) {
  .header-cell-wrapper {
    padding: 0 5px;
  }

  .ant-table-tbody {
    .ant-table-cell {
      padding: 5px 5px;
    }
  }
  tr.row-selected {
    td {
      background: var(--success-bd-color);
    }
  }

  tr.row-selected-next {
    td {
      background: var(--error-bd-color);
    }
  }
}

.log-table {
  width: 260px;
}

.title {
  padding: 0 30px 0 0;
  background: var(--success-bd-color);
  font-weight: bold;

  .left {
    background: var(--error-bd-color);
  }
}

.width-50 {
  width: 50%;
}

.viewer-wrapper {
  border: 1px solid #ccc;
  background: #fafafa;
}
</style>
