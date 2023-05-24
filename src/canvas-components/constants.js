export const NOOP = () => {};
// 组件的key
export const COMP_KEY = {
  SINGLE_SELECT: 'single_select',
  MULTI_SELECT: 'multi_select',
  BOOL_SELECT: 'bool_select',
  INPUT: 'input',
  DATETIME: 'datetime',
  DATETIME_RANGE: 'datetime_range',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  OP_NUMBER: 'op_number',
  OP_DATETIME: 'op_datetime',
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

export const SELECT_COMP_TYPE = {
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  BTN_RADIO: 'btn_radio',
  BTN_CHECKBOX: 'btn_checkbox',
};

export const SELECT_COMP_TYPE_NAME = {
  [SELECT_COMP_TYPE.SELECT]: '下拉框',
  [SELECT_COMP_TYPE.RADIO]: '普通单选框',
  [SELECT_COMP_TYPE.CHECKBOX]: '普通复选框',
  [SELECT_COMP_TYPE.BTN_RADIO]: '按钮单选框',
  [SELECT_COMP_TYPE.BTN_CHECKBOX]: '按钮复选框',
};


