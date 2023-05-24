export {
  DATA_SOURCE_TYPE,
  DATA_SOURCE_TYPE_NAME,
  MANUAL_DATA_SOURCE_TYPE,
  MANUAL_DATA_SOURCE_TYPE_NAME,
  ASYNC_STATUS,
  INIT_VAL_TYPE,
  INIT_VAL_TYPE_NAME,
} from './data-source-pool/constants';

export const CMP_ORD = {
  EQ: 'equal',      // 等于
  LT: 'less',       // 小于
  GT: 'greater',    // 大于
  BT: 'between',    // 之间
};

export const PLACEHOLDER = {
  JS_FN: 'function get({ dataSource } = {}) {  // 这一行不要修改，也不要删除\n'
    + '  // 在这里添加js逻辑，构造数据\n'
    + '  let result = []\n\n'
    + '  // 函数必须包含return语句，返回数据源的值\n'
    + '  return result;\n\n'
    + '} // 这一行不要修改，也不要删除',
  POST_JS_FN: 'function get({ dataSource, data } = {}) {  // 这一行不要修改，也不要删除\n\n'
    + '  // 在这里添加js逻辑，构造数据\n\n'
    + '  // 函数必须包含return语句，返回数据源的值\n'
    + '  return data;\n\n'
    + '} // 这一行不要修改，也不要删除\n'
    + '//若js配置无误，保存后，会将经过js处理的数据结果作为该数据的取值',
  STATIC_DATA: 'const data = // 这一行不要修改，也不要删除\n'
    + '// 在这里添加数据, 比如等于空数组\n'
    + '[]',
};
