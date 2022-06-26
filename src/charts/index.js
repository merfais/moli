import genPie from './pie';
import genXYAxis from './xyAxis';

export const pie = genPie('pie', '饼图');
export const ring = genPie('ring', '环图');
export const rose = genPie('rose', '玫瑰图');
export const radiusRose = rose;
export const areaRose = genPie('areaRose', '玫瑰图');
export const line = genXYAxis({
  type: 'line',
  name: '折线图',
  seriesType: 'line',
  categoryAxis: 'xAxis',
});
export const multiLine = genXYAxis({
  type: 'multiLine',
  name: '折线图',
  seriesType: 'line',
  categoryAxis: 'xAxis',
});
export const stackLine = genXYAxis({
  type: 'stackLine',
  name: '堆叠折线图',
  seriesType: 'line',
  categoryAxis: 'xAxis',
  stack: true,
});
export const areaLine = genXYAxis({
  type: 'areaLine',
  name: '面积图',
  seriesType: 'line',
  categoryAxis: 'xAxis',
  area: true,
});
export const areaMultiLine = genXYAxis({
  type: 'areaMultiLine',
  name: '面积图',
  seriesType: 'line',
  categoryAxis: 'xAxis',
  area: true,
});
export const areaStackLine = genXYAxis({
  type: 'areaStackLine',
  name: '堆叠面积图',
  seriesType: 'line',
  categoryAxis: 'xAxis',
  stack: true,
  area: true,
});
export const areaPercentLine = genXYAxis({
  type: 'areaPercentLine',
  name: '百分比面积图',
  seriesType: 'line',
  categoryAxis: 'xAxis',
  stack: true,
  area: true,
  percent: true,
});
export const bar = genXYAxis({
  type: 'bar',
  name: '柱状图',
  seriesType: 'bar',
  categoryAxis: 'xAxis',
});
export const yBar = genXYAxis({
  type: 'yBar',
  name: '条形图',
  seriesType: 'bar',
  xAxisType: 'value',
  yAxisType: 'category',
  categoryAxis: 'yAxis',
});
export const multiBar = genXYAxis({
  type: 'multiBar',
  name: '柱状图',
  seriesType: 'bar',
  categoryAxis: 'xAxis',
});
export const multiYBar = genXYAxis({
  type: 'multiYBar',
  name: '条形图',
  seriesType: 'bar',
  xAxisType: 'value',
  yAxisType: 'category',
  categoryAxis: 'yAxis',
});
export const stackBar = genXYAxis({
  type: 'stackBar',
  name: '堆叠柱状图',
  seriesType: 'bar',
  categoryAxis: 'xAxis',
  stack: true,
});
export const percentBar = genXYAxis({
  type: 'percentBar',
  name: '百分比柱状图',
  seriesType: 'bar',
  categoryAxis: 'xAxis',
  stack: true,
  percent: true,
});
export const stackYBar = genXYAxis({
  type: 'stackYBar',
  name: '堆叠条形图',
  seriesType: 'bar',
  xAxisType: 'value',
  yAxisType: 'category',
  categoryAxis: 'yAxis',
  stack: true,
});
export const percentYBar = genXYAxis({
  type: 'percentYBar',
  name: '百分比条形图',
  seriesType: 'bar',
  xAxisType: 'value',
  yAxisType: 'category',
  categoryAxis: 'yAxis',
  stack: true,
  percent: true,
});
