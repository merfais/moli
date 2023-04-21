export const MANUAL_DATA_SOURCE_TYPE = {
  JS_FUNCTION: 'js_function',
  CUSTOM_API: 'custom_api',
  STATIC_DATA: 'static_data',
};
export const MANUAL_DATA_SOURCE_TYPE_NAME = {
  [MANUAL_DATA_SOURCE_TYPE.JS_FUNCTION]: 'JS函数',
  [MANUAL_DATA_SOURCE_TYPE.CUSTOM_API]: '自定义API',
  [MANUAL_DATA_SOURCE_TYPE.STATIC_DATA]: '静态数据',
};

export const DATA_SOURCE_TYPE = {
  INPUT_LIKE_VIEW: 'input_like_view',
  SELECT_LIKE_VIEW: 'select_like_view',
  ...MANUAL_DATA_SOURCE_TYPE,
};

export const DATA_SOURCE_TYPE_NAME = {
  [DATA_SOURCE_TYPE.INPUT_LIKE_VIEW]: '输入框导出',
  [DATA_SOURCE_TYPE.SELECT_LIKE_VIEW]: '筛选器导出',
  ...MANUAL_DATA_SOURCE_TYPE_NAME,
};

export const ASYNC_STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
};

export const VALUE_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
};

