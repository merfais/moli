import {
  has,
  merge,
  set,
} from 'lodash-es';
import { MODE } from '../constants';

export default function genLegend(option, {
  mode = MODE.PC,
  type,
  series = [],
  footer = {},
}) {
  const dft = {
    show: true,
  };
  let bottom = 50;
  if (mode === MODE.MP) {
    set(dft, 'textStyle.fontSize', 10);
    bottom = 40;
  }
  if (footer.show === false) {
    bottom -= 35;
  }
  // 非饼图中，如果只有一个维度，隐藏图例
  if (type !== 'pie' && series.length < 2) {
    dft.show = false;
  }
  const legend = merge(dft, option);
  // 未指定legend的位置，则放在下面
  if (!has(legend, 'top') || !has(legend, 'bottom')) {
    legend.bottom = bottom;
  }
  return legend;
}
