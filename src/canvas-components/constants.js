// 组件的key
export const COMP_KEY = {
  SINGLE_SELECT: 'singleSelect',
  MULTI_SELECT: 'multiSelect',
  BOOL_SELECT: 'boolSelect',
  INPUT: 'input',
  DATETIME: 'datetime',
  DATETIME_RANGE: 'datetimeRange',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  OP_NUMBER: 'opNumber',
  OP_DATETIME: 'opDatetime',
};

export const COMP_GROUP_KEY = {
  CHART: 'chart',
  INTERACT: 'interact',
  PANEL: 'panel',
  RICH: 'rich',
};

// 值类型
export const VALUE_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
};

export const VALUE_TYPE_NANE = {
  [VALUE_TYPE.STRING]: '字符串',
  [VALUE_TYPE.NUMBER]: '数字',
  [VALUE_TYPE.BOOLEAN]: '布尔',
};

export const DATA_SOURCE_TYPE = {
  STATIC: 'static',
  DYNAMIC: 'dynamic',
};

export const EDITOR_MENU = {
  BASIC: 'basic',
  LABEL: 'label',
  DS: 'ds',
  LAYOUT: 'layout',
  STYLE: 'style',
};

export const EDITOR_MENU_NAME = {
  [EDITOR_MENU.BASIC]: '基础配置',
  [EDITOR_MENU.LABEL]: 'Label 配置',
  [EDITOR_MENU.DS]: '导出数据配置',
  [EDITOR_MENU.LAYOUT]: '布局配置',
  [EDITOR_MENU.STYLE]: '样式配置',
};
