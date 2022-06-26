<script setup>
import { init } from 'echarts';
import { Empty } from 'ant-design-vue';
import Chart from '@/charts/components/chart';

defineProps({
  chartOption: Object,
});

const dftOpt = {
  footer: false,
  watermark: false,
};

</script>
<template>
  <Chart
    :initEcharts="init"
    :chartOption="{ ...dftOpt, ...chartOption }"
  >
    <template #empty>
      <AEmpty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </template>
  </Chart>
</template>
<style scoped>
</style>
