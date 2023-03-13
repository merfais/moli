import { forEach } from 'lodash-es';

/**
 * 校验普通字符，只能包含数字，字符，下划线
 */
export function isNormalChar(value) {
  if (/[^\w]/.test(value) || /^\d/.test(value)) {
    return '只能由数字、字母、下划线组成，且不能以数字开头';
  }
}

export function isChinese(value) {
  if (!value) return;
  if (!/.*[\u4e00-\u9fa5]+.*/.test(value)) {
    return '需要由中英文组成';
  }
}

export function isDecimal(value) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  // 科学计数法
  if (/^-?\d+\.?\d*e-\d+$/.test(value)) {
    return;
  }
  if (!/^-?((\d+\.\d+)|\d+)$/.test(value)) {
    return '只能是小数';
  }
}

export function isInt(value) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  // 科学计数法
  if (/^-?\d+\.?\d*e\+?\d+$/.test(value)) {
    return;
  }
  if (!/^-?\d+$/.test(value)) {
    return '只能是整形';
  }
}

export function isNumber(value) {
  if (isInt(value)) {
    return '只能是数字';
  }
  if (isDecimal(value)) {
    return '只能是数字';
  }
}

export function isBoolean(value) {
  if (!/^(true|false)$/.test(value)) {
    return '只能是布尔值';
  }
}

export function fieldsRequired(fields) {
  return (value) => {
    let valid = true;
    forEach(fields, (key) => {
      if (!value[key] && value[key] !== 0 && value[key] !== false) {
        valid = false;
      }
      return valid;
    });
    return !valid && '此字段是必填的';
  };
}

export const required = {
  required: true,
  message: '此字段是必填的',
};

export const notEmpty = {
  required: true,
  validator: genValidator((value) => {
    const msg = '此字段是必填的';
    if (value === undefined || value === null) {
      return msg;
    }
    if (typeof value === 'string' && !value.trim()) {
      return msg;
    }
    if (Array.isArray(value) && !value.length) {
      return msg;
    }
    if (typeof value === 'object' && !Object.keys(value).length) {
      return msg;
    }
  }),
};

export function genValidator(rule) {
  return async (_, value) => {
    const msg = await rule(value);
    if (msg) {
      return Promise.reject(msg);
    }
  };
}

export function useRules(options, ...rest) {
  let rules = [];
  if (rest.length && !Array.isArray(options)) {
    rules = [options, ...rest];
  } else {
    rules = Array.isArray(options) ? options : [options];
  }
  return rules.map((rule) => {
    // 函数
    if (typeof rule === 'function') {
      return { validator: genValidator(rule) };
    }
    // 对象
    return rule;
    // 其他类型不支持
  });
}

