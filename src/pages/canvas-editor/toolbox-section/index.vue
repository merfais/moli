<script setup>
import {
  get,
  forEach,
} from 'lodash-es';
import {
  ref,
  unref,
  reactive,
} from 'vue';
import {
  AppstoreAddOutlined,
} from '@ant-design/icons-vue';
import { errorLog } from '@/uses/log';
import {
  getCompGroupConfig,
  getCompConfig,
  COMP_GROUP_KEY,
} from '@/canvas-components';
import {
  useCanvasEditorStore,
} from '../use-canvas-store';

const store = useCanvasEditorStore();

const activeKey = ref([
  COMP_GROUP_KEY.CHART,
  COMP_GROUP_KEY.INTERACT,
]);
const compGroup = ref([]);
const compConfigMap = reactive({});

function onDragStart(compKey) {
  store.draggingCompKey = compKey;
}

async function init() {
  try {
    const groupConfig = await getCompGroupConfig();
    compGroup.value = groupConfig;
  } catch (e) {
    errorLog({ e, msg: '获取组件配置出错' });
    return;
  }

  forEach(unref(compGroup), gItem => {
    forEach(gItem.comps, compKey => {
      getCompConfig(compKey).then(config => {
        compConfigMap[compKey] = config;
      }).catch(err => {
        console.error('获取组件配置出错', err);
      });
    });
  });
}

init();

</script>
<template>
  <section class="comp-selector-section height-100 ">
    <ACollapse
      v-model:activeKey="activeKey"
    >
      <ACollapsePanel v-for="gItem in compGroup"
        :key="gItem.groupKey"
        :header="gItem.groupName"
      >
        <div v-for="(compKey, index) in gItem.comps"
          :key="compKey + index"
          class="comp-snap-wrapper flex-column flex-center"
          draggable="true"
          unselectable="on"
          @dragstart="onDragStart(compKey)"
        >
          <AppstoreAddOutlined class="snap-icon" />
          <div>{{get(compConfigMap, [compKey, 'name'])}}</div>
        </div>
      </ACollapsePanel>
    </ACollapse>
  </section>
</template>
<style scoped>
.comp-selector-section {
  width: 269px;
  overflow-y: scroll;
  padding-top: 1px;
  box-shadow: 1px 0 1px #d9d9d9, 1px 0 5px #f1f1f1;

  :deep(.ant-collapse) {
    border-right: 0;

    .ant-collapse-content-box {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .comp-snap-wrapper {
    width: 60px;
    height: 60px;
    border: 1px dashed #aaa;
    margin: 8px;
    border-radius: 4px;
    opacity: 0.7;
    user-select: none;

    &:hover {
      opacity: 1;
      cursor: move;
      border-color: #666;
    }
  }

  .snap-icon {
    font-size: 26px;
  }
}
</style>
