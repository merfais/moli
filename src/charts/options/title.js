import { merge, set } from 'lodash-es';
import { MODE } from '../constants';

export default function genTitle(options, mode = MODE.PC) {
  const dft = {
    show: true,
    left: 20,
    top: 20,
    text: '',
    subtext: '',
  };
  if (mode === MODE.MP) {
    set(dft, 'textStyle.fontSize', 16);
    set(dft, 'subtextStyle.fontSize', 10);
  }
  const optionArr = Array.isArray(options) ? options : [options];
  const title = merge(dft, ...optionArr);
  if (!title.text && !title.subtext) {
    title.show = false;
  }
  return title;
}
