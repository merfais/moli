import { DATA_SOURCE_TYPE } from '@/constants';
import {
  COMP_KEY,
  VALUE_TYPE,
} from '../constants';

export default function genConf() {
  const config = {
    key: COMP_KEY.INPUT,
    name: '输入框',
    snap: 'filters/icon-input',
    layout: {
      // 电脑端
      pc: {
        w: 125,
        h: 32,
        // 最小宽度和高度，单位px
        mw: 72,
        mh: 32,
      },
      // 移动端初始高度，单位为像素
      mobile: {
        w: 30,
        h: 8,
        mw: 15,
        mh: 8,
      },
    },
    dftConf: {
      withLabel: false,
      label: undefined,
      labelPos: 'left',
      value: undefined,
      valueType: VALUE_TYPE.STRING,
      placeholder: undefined,
      disabledDS: '',
    },
    style: {
      pc: {
        width: undefined,
        height: undefined,
        marginTop: undefined,
        marginRight: undefined,
        marginBottom: undefined,
        marginLeft: undefined,
      },
      mobile: {
        width: undefined,
        height: undefined,
        marginTop: undefined,
        marginRight: undefined,
        marginBottom: undefined,
        marginLeft: undefined,
      },
    },
    dataSource: [{
      idPrefix: 'inputValue',
      type: DATA_SOURCE_TYPE.INPUT_LIKE_VIEW,
    }],
  };
  return config;
}

