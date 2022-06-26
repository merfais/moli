import {
  forEach,
  get,
  has,
  merge,
} from 'lodash-es';
import { MODE } from '../constants';

function getEncodeAxis(options = {}) {
  let xAxis = get(options, 'xAxis', []);
  if (!Array.isArray(xAxis)) {
    xAxis = [xAxis];
  }
  const xAxisType = get(options, 'xAxisType', 'category');
  const xAxisIndex = get(options.seriesItem, 'xAxisIndex', 0);
  if (get(xAxis, `[${xAxisIndex}].type`, xAxisType) === 'value') {
    return {
      valueAxis: 'x',
      categoryAxis: 'y',
    };
  }
  return {
    valueAxis: 'y',
    categoryAxis: 'x',
  };
}

function getEncode({
  index,
  categoryAxis,
  valueAxis,
  dataRow = [],
  dataKeys = [],
  dataOption = {},
} = {}) {
  if (Array.isArray(dataRow)) {
    return {
      [categoryAxis]: 0,
      [valueAxis]: index + 1,
    };
  }

  // 提取所有字段的key，如果没有指定dataOption中xAxis, yAxis的值，
  // 则按keys的顺序对encode编码
  const [categoryKey, ...valueKeys] = dataKeys;
  const categoryAxisKeys = get(dataOption, `${categoryAxis}Axis`, [categoryKey]);
  const valueAxisKeys = get(dataOption, `${valueAxis}Axis`, valueKeys);
  return {
    [categoryAxis]: categoryAxisKeys[0],
    [valueAxis]: valueAxisKeys[index],
  };
}

function getLineConf({ area, dataset } = {}) {
  // 当设定面积图时，补充areaStyle参数
  if (area) {
    return { areaStyle: {} };
  }
  // 当数据小于10条时，凸显数据点
  if (dataset.length <= 10) {
    return {
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 2,
      },
      symbolSize: 8,
      symbol: 'circle',
    };
  }
}

function setLabelConf({ series, dataset, mode = MODE.PC } = {}) {
  // 只有一个系列(维度)的数据, 且小于10条数据时，显示label
  if (series.length !== 1 || dataset.length > 10) {
    return;
  }
  const [seriesItem] = series;
  const fontSize = mode === MODE.MP ? 12 : 14;
  const label = {
    show: true,
    fontSize,
    position: 'top',
    color: '#333333',
  };
  // 横向柱状图的label，显示到柱的内部
  if (seriesItem.type === 'bar' && seriesItem.categoryAxis === 'y') {
    Object.assign(label, {
      position: 'insideRight',
      color: '#ffffff',
    });
  }
  seriesItem.label = merge(label, seriesItem.label);
}

function getSeriesArr({ option, dataRow, dataKeys } = {}) {
  // 提供了series的参数
  if (Array.isArray(option)) {
    return option;
  }
  if (option) {
    return [option];
  }

  // 未传递series参数，使用dataset生成
  let seriesCount = 0;
  if (Array.isArray(dataRow)) {
    seriesCount = dataRow.length - 1;
  } else if (typeof dataRow === 'object') {
    seriesCount = dataKeys.length - 1;
  }
  if (seriesCount < 1) {
    seriesCount = 0;
  }
  return new Array(seriesCount).fill({});
}

export default function genSeries(option, {
  mode = MODE.PC,
  seriesType = 'line',
  stack,
  area,
  dataset = [],
  dimName = {},
  dataOption = {},
  xAxis,
  xAxisType = 'category',
  color = [],
}) {
  const [dataRow] = dataset;
  let dataKeys = [];
  if (dataRow) {
    dataKeys = Object.keys(dataRow);
  }

  const seriesArr = getSeriesArr({ option, dataRow, dataKeys });
  const series = [];
  forEach(seriesArr, (seriesItem = {}, index) => {
    const { categoryAxis, valueAxis } = getEncodeAxis({
      seriesItem,
      xAxis,
      xAxisType,
    });

    const encode = merge(getEncode({
      index,
      categoryAxis,
      valueAxis,
      dataRow,
      dataKeys,
      dataOption,
    }), seriesItem.encode);

    const item = {
      type: seriesType,
      name: dimName[encode[valueAxis]],
      encode,
      categoryAxis,
    };
    // 指定了encode的值，但dataset中没有这个字段，设置data使这个series不绘制
    // echarts在encode的字段非法，未指定data时，会使用默认数据绘制
    if (has(encode, valueAxis) && !new Set(dataKeys).has(encode[valueAxis])) {
      item.data = [];
    }
    if (color && color.length) {
      item.color = color[index % color.length];
    }
    if (item.stack === undefined && stack !== undefined) {
      item.stack = stack;
    }
    if (item.type === 'line') {
      merge(item, getLineConf({ area, dataset }));
    }
    series.push(merge(item, seriesItem));
  });
  setLabelConf({
    series,
    dataset,
    mode,
  });
  return series;
}
