import {
  merge,
  set,
  map,
  get,
} from 'lodash-es';
import { MODE } from '../constants';

function getDftOpt({ type, series }) {
  const item = {
    show: true,
  };
  if (type === 'pie') {
    Object.assign(item, {
      formatter: (p) => {
        let str = '';
        const seriesName = get(series, `${p.seriesIndex}.name`);
        if (seriesName) {
          str += `${seriesName}<br/>`;
        }
        str += `${p.marker}${p.name}: ${p.value} (${p.percent}%)`;
        return str;
      },
    });
  } else {
    Object.assign(item, {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    });
  }
  return item;
}

export default function genTooltip(option, {
  mode = MODE.PC,
  type,
  series = [],
} = {}) {
  const dft = getDftOpt({ type, series });
  if (mode === MODE.MP) {
    set(dft, 'textStyle.fontSize', 12);
  }

  // series全是柱状图时时，使用shadow样式
  const typeSet = new Set(map(series, ({ type }) => type));
  if (typeSet.size === 1 && typeSet.has('bar')) {
    set(dft, 'axisPointer.type', 'shadow');
  }

  const tooltip = merge(dft, option);

  return tooltip;
}
