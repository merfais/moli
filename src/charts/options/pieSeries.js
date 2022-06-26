import {
  merge,
  forEach,
  get,
  map,
} from 'lodash-es';
import { MODE } from '../constants';

function getDftOpt({
  mode,
  type,
} = {}) {
  const item = {
    type: 'pie',
    center: ['50%', '45%'],
    radius: type === 'ring' ? ['35%', '60%'] : '60%',
  };
  if (mode === MODE.MP) {
    Object.assign(item, {
      label: {
        fontSize: 10,
      },
      center: ['50%', '40%'],
      radius: type === 'ring' ? ['30%', '50%'] : '50%',
    });
  }

  if (type === 'rose' || type === 'radiusRose') {
    item.roseType = 'radius';
  } else if (type === 'areaRose') {
    item.roseType = 'area';
  }
  return item;
}

function getSeriesArr(option) {
  if (!option) {
    return [{}];
  }
  return Array.isArray(option) ? option : [option];
}

function getEncode({ dataRow, dataOption } = {}) {
  let valueIndex;
  let stringIndex;
  forEach(dataRow, (value, index) => {
    if (/^\d+$/.test(value) && valueIndex === undefined) {
      valueIndex = index;
      return;
    }
    if (typeof value === 'string' && stringIndex === undefined) {
      stringIndex = index;
    }
  });
  if (valueIndex === undefined || stringIndex === undefined) {
    return;
  }
  return {
    value: get(dataOption, 'value', valueIndex),
    itemName: get(dataOption, 'name', stringIndex),
  };
}

export default function genSeries(option, {
  type = 'pie',
  mode = MODE.PC,
  dataset = [],
  dimName = {},
  dataOption = {},
} = {}) {
  const [dataRow] = dataset;

  const seriesArr = getSeriesArr(option);
  const series = map(seriesArr, (seriesItem = {}) => {
    const encode = getEncode({
      dataRow,
      dataOption,
    });
    const item = getDftOpt({ mode, type });
    if (encode) {
      item.encode = encode;
      item.name = dimName[encode.value];
    }

    merge(item, seriesItem);

    return item;
  });

  return series;
}
