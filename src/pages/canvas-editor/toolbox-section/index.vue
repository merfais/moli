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

const activeKey = ref([
  COMP_GROUP_KEY.CHART,
  COMP_GROUP_KEY.INTERACT,
]);

const compGroup = ref([]);
const compConfigMap = reactive({});

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
  <section class="comp-selector-section height-100">
    <ACollapse
      v-model:activeKey="activeKey"
    >
      <ACollapsePanel v-for="gItem in compGroup"
        :key="gItem.groupKey"
        :header="gItem.groupName"
      >
        <div v-for="compKey in gItem.comps"
          :key="compKey"
          class="comp-snap-wrapper flex-column"
        >
          <AppstoreAddOutlined />
          <div>{{get(compConfigMap, [compKey, 'name'])}}</div>
        </div>
      </ACollapsePanel>
    </ACollapse>
  </section>
</template>
<style scoped>
.comp-selector-section {
  width: 280px;
}
</style>
