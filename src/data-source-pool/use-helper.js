import {
  VALUE_TYPE,
} from './constants';

/**
 * 对number类型数据做类型转换
 */
function convertToNumber(value) {
  const num = Number(value);
  if (!Number.isNaN(num)) {
    return num;
  }
  return 0;
}

/**
 * 对bool类型数据做类型转换
 */
function convertToBool(value) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return Boolean(value);
}

function convertToString(value) {
  if (value === null || value === undefined) {
    return 'null';
  }
  return `${value}`;
}

/**
 * 对数据做类型转换
 */
export function convertValueType(value, valueType) {
  if (valueType === VALUE_TYPE.NUMBER) {
    return convertToNumber(value);
  }
  if (valueType === VALUE_TYPE.BOOLEAN) {
    return convertToBool(value);
  }
  return convertToString(value);
}

