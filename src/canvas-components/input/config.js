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
        h: 20,
        // 最小宽度和高度，单位px
        minWidth: 72,
        minHeight: 32,
      },
      // 移动端初始高度，单位为像素
      mobile: {
        w: 30,
        h: 8,
      },
    },
    component: 'stringTpl',
    props: {
      label: '',
      value: '',
      enableMulti: false,
    },
    propEditor: {
      component: 'stringEditor',
    },
    // 对外暴露的变量
    variables: {
      value: {
        key: 'value',
        name: '值',
        valueType: VALUE_TYPE.STRING,
        default: '',
      },
    },
  };
  return config;
}

