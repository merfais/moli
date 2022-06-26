<script setup>
import {
  isFunction,
  isEqual,
  isEmpty,
  forEach,
} from 'lodash-es';
import {
  watch,
  ref,
  unref,
  computed,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import * as chartMap from '../index';
import getMockData from '../mocks';
import Cover from './cover';

const props = defineProps({
  showTable: Boolean,
  chartOption: {
    type: Object,
    default: () => ({}),
  },
  dataOption: {
    type: Object,
    default: () => ({}),
  },
  type: {
    type: String,
    default: 'line',
  },
  width: String,
  height: String,
  initTheme: Object,
  events: Object,
  getData: {
    type: Function,
    default: getMockData,
  },
  reqOpts: {},
  dataset: [Object, Array],
  loading: Boolean,
  errMsg: String,
  initEcharts: Function,
  mock: Boolean,
});

defineExpose({

});

let echart;
let cacheData = [];
let latestReq;
let getData = getMockData;

const chartDom = ref();
const innerLoading = ref(false);
const empty = ref(false);
const innerErrMsg = ref('');

const sizeStyle = computed(() => {
  const style = { height: props.height || '100%' };
  if (props.width) {
    style.width = props.width;
  }
  return style;
});

const containerStyle = computed(() => ({
  ...unref(sizeStyle),
  position: 'relative',
}));

const chartStyle = computed(() => ({
  width: '100%',
  ...unref(sizeStyle),
}));

const coverLoading = computed(() => {
  if (props.loading) {
    return props.loading;
  }
  return unref(innerLoading);
});

const coverErrMsg = computed(() => {
  if (props.errMsg) {
    return props.errMsg;
  }
  return unref(innerErrMsg);
});

watch(() => props.chartOption, (newVal, oldVal) => {
  if (!isEqual(newVal, oldVal)) {
    innerErrMsg.value = '';
    renderChart();
  }
});
watch(() => props.dataOption, (newVal, oldVal) => {
  if (!isEqual(newVal, oldVal)) {
    innerErrMsg.value = '';
    renderChart();
  }
});
watch(() => props.reqOpts, (newVal, oldVal) => {
  if (!isEqual(newVal, oldVal)) {
    refreshData();
  }
});
watch(() => props.dataset, () => {
  cacheData = props.dataset;
  renderChart();
});
watch(() => props.events, reRenderChart);
watch(() => props.type, reRenderChart);

function reRenderChart(newVal, oldVal) {
  if (!isEqual(newVal, oldVal)) {
    disposeChart();
    initChart();
  }
}

async function refreshData() {
  innerLoading.value = true;
  innerErrMsg.value = '';
  let newReq;
  let newData;
  try {
    newReq = getData(props.reqOpts);
    latestReq = newReq;
    newData = await newReq;
    // 丢弃返回慢的请求
    if (latestReq && latestReq !== newReq) {
      return;
    }
  } catch (e) {
    // 丢弃返回慢的请求
    if (latestReq && latestReq !== newReq) {
      return;
    }
    console.error('请求图卡数据出错', e);
    innerErrMsg.value = e.message;
  }
  innerLoading.value = false;
  // 返回值没有变化，不刷新
  if (!isEmpty(newData) && isEqual(cacheData, newData)) {
    return;
  }
  cacheData = newData;
  renderChart();
}

function prepareOption() {
  empty.value = true;
  const genChartOption = chartMap[props.type];
  if (!genChartOption) {
    innerErrMsg.value = `不支持的图表类型 ${props.type}`;
    return;
  }
  const option = genChartOption({
    option: props.chartOption,
    dataOption: props.dataOption,
    data: cacheData,
  });
  if (!isEmpty(option.series)) {
    empty.value = false;
  }
  return option;
}

function renderChart() {
  // 未初始化echarts实例，或从未获取过数据，则不渲染图表
  if (!echart) {
    return;
  }
  try {
    const option = prepareOption();
    echart.setOption(option, true, true);
  } catch (e) {
    console.error('echart.setOption出错', e);
    innerErrMsg.value = e.message;
  }
}

function onResize() {
  if (echart) {
    echart.resize();
  }
}

function initChart() {
  echart = props.initEcharts(chartDom.value, props.initTheme);
  window.echart = echart;
  window.isEqual = isEqual;
  if (!echart) {
    return;
  }
  forEach(props.events, (args, event) => {
    if (isFunction(args)) {
      echart.on(event, args);
    } else {
      echart.on(event, ...args);
    }
  });
  innerErrMsg.value = '';
  renderChart();
}

function disposeChart() {
  if (!echart) {
    return;
  }
  forEach(props.events, (fn, event) => {
    echart.off(event);
  });
  echart.dispose();
  echart = null;
}

let observer;

onMounted(() => {
  if (!props.mock) {
    getData = props.getData || (() => []);
  }
  initChart();
  if (props.reqOpts || props.mock) {
    refreshData();
  } else {
    if (props.dataset) {
      cacheData = props.dataset;
    }
    renderChart();
  }
  window.addEventListener('resize', onResize);
  observer = new ResizeObserver(() => {
    onResize();
  });
  observer.observe(unref(chartDom));
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  disposeChart();
  observer.disconnect();
});

</script>
<template>
  <div :style="containerStyle">
    <div ref="chartDom" :style="chartStyle" />
    <div v-if="showTable"
      class="table-wrapper"
      :style="sizeStyle"
    >
      <slot name="table"
        :dataSource="dataSource"
        :columns="columns"
      />
    </div>
    <Cover
      :loading="coverLoading"
      :errorMsg="coverErrMsg"
      :empty="empty"
    >
      <template #empty>
        <slot name="empty" />
      </template>
      <template #error="slotProps">
        <slot name="error" v-bind="slotProps" />
      </template>
    </Cover>
  </div>
</template>
<style scoped>
.table-wrapper {
  position: absolute;
  zIndex: 1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
}
</style>
