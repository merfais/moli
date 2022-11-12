import {
  COMP_KEY,
  VALUE_TYPE,
  DATA_SOURCE_TYPE,
} from '../constants';

export default function genConf() {
  const config = {
    key: COMP_KEY.SELECT,
    name: '下拉框',
    icon: 'filters/icon-select',
    layout: {
      pc: {
        w: 25,
        h: 3,
        // 最小宽度和高度，单位px
        minWidth: 95,
        minHeight: 32,
      },
      // 移动端初始高度，单位为像素
      mobile: {
        w: 30,
        h: 4,
      },
    },
    component: 'selectTpl',
    props: {
      mode: 'default', // 选择模式
      options: [], // 配置选项
      value: undefined, // 选择器的值
      enableSelectAll: false,
      enableSelectFirst: false,
      specialValue: '',
      selectionType: DATA_SOURCE_TYPE.DYNAMIC,
      labelField: undefined,
      valueField: undefined,
      variable: '',
    },
    propEditor: {
      component: 'selectEditor',
      destroyWhenHide: true,
    },
    // 对外暴露的变量
    variables: {
      itemValue: {
        key: 'value',
        name: '值',
        valueType: VALUE_TYPE.STRING,
        default: {
          value: '',
          label: '',
        },
        // 下拉框的选项options可能会依赖其他变量，
        // 记录在options中，用于收集变量的依赖关系
        options: {
          variable: '',
          mode: 'default', // 选择模式
          options: [], // 配置选项
          specialValue: '',
          labelField: 'label',
          valueField: 'value',
          total: {
            enable: false,
            label: '合计',
            value: 'total',
          },
        },
      },
    },
  };
  return config;
}

