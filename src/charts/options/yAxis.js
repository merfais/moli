import {
  merge,
  forEach,
  map,
} from 'lodash-es';

function getDftOpt(options = {}) {
  return {
    show: true,
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
      },
    },
    ...options,
  };
}

export default function genYAxis(option, {
  yAxisType = 'value',
  series = [],
  dataset = [],
} = {}) {
  let yAxisArr = [{}];
  if (option) {
    yAxisArr = Array.isArray(option) ? option : [option];
  }

  const boundaryGapArr = [];
  forEach(series, (seriesItem = {}) => {
    const { type, categoryAxis, yAxisIndex = 0 } = seriesItem;
    // x轴时类目轴且在柱状图中时，设置 boundaryGap = true
    if (categoryAxis === 'y' && type === 'bar') {
      boundaryGapArr[yAxisIndex] = true;
    }
  });

  const yAxis = map(yAxisArr, (yAxisItem, index) => {
    const dft = getDftOpt({
      type: yAxisType,
      boundaryGap: boundaryGapArr[index] || false,
      alignTicks: true,
    });
    const item = merge(dft, yAxisItem);
    if (item.type === 'category' && dataset.length === 0) {
      item.show = false;
    }
    return item;
  });
  return yAxis;
}
