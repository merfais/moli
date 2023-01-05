// 组件的key
export const COMP_KEY = {
  SELECT: 'select',
  INPUT: 'input',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
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
  VARS: 'vars',
  LAYOUT: 'layout',
  STYLE: 'style',
};

export const EDITOR_MENU_NAME = {
  [EDITOR_MENU.BASIC]: '基础配置',
  [EDITOR_MENU.LABEL]: 'Label 配置',
  [EDITOR_MENU.VARS]: '变量配置',
  [EDITOR_MENU.LAYOUT]: '布局配置',
  [EDITOR_MENU.STYLE]: '样式配置',
};
