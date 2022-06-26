import { get } from 'lodash-es';
import { MODE, DEFAULT_WIDTH } from '../constants';

const DEFAULT = {
  [MODE.PC]: {
    fontSize: 14,
    logoSize: { top: 12, height: 14, width: 49 },
    textTop: 14,
    textLeft: 75,
    textRight: 20,
  },
  [MODE.MP]: {
    fontSize: 12,
    logoSize: { top: 10, height: 12, width: 42 },
    textTop: 12,
    textLeft: 70,
    textRight: 20,
  },
};

/**
 * 生成横线
 */
function genLineConf(options, mode) {
  const width = get(options, 'width', DEFAULT_WIDTH[mode]);
  const y = get(options, 'line.y', 0);
  const xGap = get(options, 'line.xGap', 20);
  const stroke = get(options, 'line.color', '#E3E3E3');
  return {
    type: 'line',
    shape: {
      x1: xGap,
      y1: y,
      x2: width - xGap,
      y2: y,
    },
    style: {
      stroke,
    },
  };
}

/**
 * 生成左侧的文字
 */
function genLeftConf(options, logoConf, mode) {
  const { fontSize, textTop, textLeft } = DEFAULT[mode];
  const left = logoConf ? textLeft : 20;
  return {
    type: 'text',
    left: get(options, 'left.left', left),
    right: get(options, 'left.right'),
    top: get(options, 'left.top', textTop),
    style: {
      text: get(options, 'left.text', '制作方: 品牌'),
      fill: get(options, 'left.color', '#666666'),
      font: `${get(options, 'left.fontSize', fontSize)}px Microsoft YaHei`,
    },
  };
}

/**
 * 生成右侧的文字
 */
function genRightConf(options, logoConf, mode) {
  const { fontSize, textTop, textRight } = DEFAULT[mode];
  const right = logoConf ? textRight : 20;
  return {
    type: 'text',
    right: get(options, 'right.right', right),
    left: get(options, 'right.left'),
    top: get(options, 'right.top', textTop),
    style: {
      text: get(options, 'right.text', '数据来源: 互联网'),
      fill: get(options, 'right.color', '#666666'),
      font: `${get(options, 'right.fontSize', fontSize)}px Microsoft YaHei`,
    },
  };
}

/**
 * 生成logo
 */
function genLogoConf(options, mode) {
  const image = get(options, 'logo.image');
  if (!image) {
    return;
  }
  const { logoSize } = DEFAULT[mode];
  return {
    type: 'image',
    left: get(options, 'logo.left', 20),
    right: get(options, 'logo.right'),
    top: get(options, 'logo.top', logoSize.top),
    style: {
      image,
      width: get(options, 'logo.width', logoSize.width),
      height: get(options, 'logo.height', logoSize.height),
    },
  };
}

/**
 * 生成footer
 *
 * @param {
 *   show: boolean
 *   width: number,
 *   position: {
 *     left: number,
 *     right: number,
 *     top: number,
 *     bottom: number,
 *   },
 *   line: {
 *     y: number,
 *     xGap: number,
 *     color: string,
 *   },
 *   logo: {
 *     image: string,
 *     left: number,
 *     right: number,
 *     top: number,
 *     width: number,
 *     height: number,
 *   },
 *   left: {
 *     left: number,
 *     right: number,
 *     top: number,
 *     text: string,
 *     color: string,
 *     fontSize: number,
 *   },
 *   right: {
 *     left: number,
 *     right: number,
 *     top: number,
 *     text: string,
 *     color: string,
 *     fontSize: number,
 *   }
 * } options
 */
export default function genFooter(options = {}, mode = MODE.PC) {
  if (options === false) {
    return { show: false };
  }
  const width = get(options, 'width', DEFAULT_WIDTH[mode]);
  const lineConf = genLineConf(options, mode);
  const logoConf = genLogoConf(options, mode);
  const rightConf = genRightConf(options, logoConf, mode);
  const leftConf = genLeftConf(options, logoConf, mode);
  const position = { bottom: 10 };
  return {
    show: get(options, 'show', true),
    id: 'footer',
    type: 'group',
    width: get(options, 'width', width),
    ...get(options, 'position', position),
    children: [lineConf, rightConf, logoConf, leftConf],
  };
}
