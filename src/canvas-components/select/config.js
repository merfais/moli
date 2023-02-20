import { DATA_SOURCE_TYPE } from '@/constants';
import {
  COMP_KEY,
  VALUE_TYPE,
} from '../constants';

export default function genConf() {
  const config = {
    key: COMP_KEY.SELECT,
    name: '下拉框',
    snap: 'filters/icon-select',
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
      multiple: false,
      options: [],
      value: undefined,
      valueType: VALUE_TYPE.STRING,
      enableSelectAll: false,
      specialValue: '',
      labelField: 'label',
      valueField: 'value',
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
      idPrefix: 'selectValue',
      type: DATA_SOURCE_TYPE.SELECT_LIKE_VIEW,
    }],
  };
  return config;
}

