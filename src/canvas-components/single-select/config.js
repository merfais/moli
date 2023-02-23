import { DATA_SOURCE_TYPE } from '@/constants';
import {
  COMP_KEY,
} from '../constants';

export default function genConf() {
  const config = {
    key: COMP_KEY.SINGLE_SELECT,
    name: '单选器',
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
        h: 32,
        mw: 15,
        mh: 32,
      },
    },
    dftConf: {
      withLabel: false,
      label: undefined,
      labelPos: 'left',
      placeholder: undefined,
      disabled: false,
      options: [],
      value: undefined,
      initVal: 'static',
      labelField: 'label',
      valueField: 'value',
      compType: 'select',
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
      idPrefix: 'singleValue',
      type: DATA_SOURCE_TYPE.SELECT_LIKE_VIEW,
    }],
  };
  return config;
}

