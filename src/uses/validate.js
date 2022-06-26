/**
 * 校验普通字符，只能包含数字，字符，下划线
 */
export function isNormalChar(value) {
  if (/[^\w]/.test(value)) {
    return '只能由数字、字母、下划线组成';
  }
}

export function isNumber(value) {
  if (!/^\d+$/.test(value)) {
    return '只能是数字';
  }
}

export function isBoolean(value) {
  if (!/^(true|false)$/.test(value)) {
    return '只能是布尔值';
  }
}

export const required = {
  required: true,
  message: '此字段是必填的',
};

function genValidator(rule) {
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
