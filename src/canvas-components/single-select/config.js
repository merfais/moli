import {
  DATA_SOURCE_TYPE,
  INIT_VAL_TYPE,
} from '@/constants';
import {
  COMP_KEY,
  SELECT_COMP_TYPE,
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
      depDSs: {
        options: undefined,
        disabled: undefined,
      },
      value: undefined,
      initValType: INIT_VAL_TYPE.STATIC,
      labelField: 'label',
      valueField: 'value',
      compType: SELECT_COMP_TYPE.SELECT,
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
      type: DATA_SOURCE_TYPE.SELECT_LIKE_VIEW,
      syncConf: [
        'initValType',
        'labelField',
        'valueField',
      ],
    }],
  };
  return config;
}

