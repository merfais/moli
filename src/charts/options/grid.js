import { merge, forEach } from 'lodash-es';
import { MODE } from '../constants';

export default function genGrid(options, {
  footer = {},
  title = {},
  legend = {},
  mode = MODE.PC,
} = {}) {
  const dft = {
    top: 90,
    bottom: 100,
    left: 30,
    right: 40,
  };
  if (mode === MODE.MP) {
    forEach(dft, (v, k) => dft[k] = v - 10);
  }
  dft.containLabel = true;
  if (footer.show === false) {
    dft.bottom -= 40;
  }
  if (legend.show === false) {
    dft.bottom -= 30;
  }
  if (title.show === false) {
    dft.top -= 40;
  }
  const grid = merge(dft, options);
  return grid;
}
