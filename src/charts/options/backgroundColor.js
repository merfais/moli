import {
  merge,
} from 'lodash-es';
import { MODE } from '../constants';

const DEFAULT = {
  [MODE.PC]: {
    fontSize: 20,
    size: 120,
  },
  [MODE.MP]: {
    fontSize: 18,
    size: 100,
  },
};

/**
 * 生成水印的canvas对象
 */
function genWatermarkCanvas(watermark = {}) {
  const {
    fontSize, text, color, alpha, backgroundColor,
  } = watermark;
  const dpr = window.devicePixelRatio;
  let { size } = watermark;
  if (size < 1) {
    size = 1;
  } else if (size > 120) {
    size = 120;
  }
  const dsize = size * dpr;
  const canvas = document.createElement('canvas');
  canvas.width = dsize;
  canvas.height = dsize;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = backgroundColor || 'transparent';
  ctx.fillRect(0, 0, dsize, dsize);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = alpha / 100;
  ctx.font = `${fontSize * dpr}px Microsoft Yahei`;
  ctx.fillStyle = color;
  ctx.translate(dsize / 2, dsize / 2);
  ctx.rotate(-Math.PI / 6);
  ctx.fillText(text, 0, 0);
  return canvas;
}

/**
 * 生成水印
 */
function genWatermark({
  watermark = {},
  backgroundColor,
  mode,
}) {
  if (watermark === false) {
    return;
  }
  const { fontSize, size } = DEFAULT[mode];
  const watermarkConf = merge({
    show: true,
    fontSize,
    text: '水印',
    color: '#000000',
    size,
    alpha: 10,
    backgroundColor,
  }, watermark);
  if (watermarkConf.show) {
    return {
      image: genWatermarkCanvas(watermarkConf),
      repeat: 'repeat',
    };
  }
}

export default function genBackgroudColor(options, {
  watermark: watermarkConf = {},
  mode = MODE.PC,
} = {}) {
  const backgroundColor = options || 'transparent';
  let complexColor;
  if (typeof backgroundColor !== 'string') {
    // 渐变色
    // {
    //   type: 'linear',
    //   x: 0,
    //   y: 0,
    //   x2: 0,
    //   y2: 1,
    //   colorStops: [{
    //     offset: 0, color: 'red' // 0% 处的颜色
    //   }, {
    //     offset: 1, color: 'blue' // 100% 处的颜色
    //   }],
    //   global: false // 缺省为 false
    // }
    complexColor = backgroundColor;
  }

  const watermark = genWatermark({
    watermark: watermarkConf,
    backgroundColor,
    mode,
  });
  if (watermark) {
    return watermark;
  }
  if (complexColor) {
    return complexColor;
  }
  return backgroundColor;
}
