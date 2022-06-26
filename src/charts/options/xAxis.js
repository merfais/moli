import {
  merge,
  forEach,
  map,
} from 'lodash-es';

function getDftOpt(options = {}) {
  return {
    show: true,
    ...options,
  };
}
export default function genXAxis(option, {
  xAxisType = 'category',
  series = [],
  dataset = [],
} = {}) {
  let xAxisArr = [{}];
  if (option) {
    xAxisArr = Array.isArray(option) ? option : [option];
  }

  const boundaryGapArr = [];
  const alignWithLabelArr = [];
  forEach(series, (seriesItem = {}) => {
    const { type, categoryAxis, xAxisIndex = 0 } = seriesItem;
    // x轴时类目轴且在柱状图中时，设置 boundaryGap = true
    if (categoryAxis === 'x') {
      boundaryGapArr[xAxisIndex] = true;
      if (type === 'line') {
        alignWithLabelArr[xAxisIndex] = true;
      }
    }
  });

  const xAxis = map(xAxisArr, (xAxisItem, index) => {
    const dft = getDftOpt({
      type: xAxisType,
      boundaryGap: boundaryGapArr[index] || false,
      alignTicks: true,
      axisTick: {
        alignWithLabel: alignWithLabelArr[index] || false,
      },
    });
    const item = merge(dft, xAxisItem);
    if (item.type === 'category' && dataset.length === 0) {
      item.show = false;
    }
    return item;
  });
  return xAxis;
}
