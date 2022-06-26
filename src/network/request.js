import {
  has,
  assign,
  isEmpty,
  omit,
} from 'lodash-es';
import axios from 'axios';
import qs from 'qs';

function prepareUrl(url, params, data) {
  return url.replace(/\/:(\w+)/g, (m, key) => {
    if (has(params, key)) {
      const value = params[key];
      delete params[key]; // eslint-disable-line no-param-reassign
      return `/${value}`;
    } if (has(data, key)) {
      const value = data[key];
      delete data[key]; // eslint-disable-line no-param-reassign
      return `/${value}`;
    }
  });
}

export default function request(options) {
  let {
    method, params, data, url, headers,
  } = options;
  method = method || 'get';
  params = { ...params };
  headers = { ...headers };
  data = { ...(data || {}) };
  if (/get/i.test(method)) {
    assign(params, data); // get 合并data到params
    data = null;
    url = prepareUrl(url, params);
  } else {
    url = prepareUrl(url, params, data);
    if (!options.useJson) {
      Object.assign(headers, {
        'content-type': 'application/x-www-form-urlencoded',
      });
    }
  }

  const opts = {
    ...omit(options, ['params', 'data', 'headers', 'useJson']),
    method,
    url,
    withCredentials: true,
  };
  if (!isEmpty(params)) {
    opts.params = params;
  }
  if (!isEmpty(data)) {
    opts.data = headers['content-type'] ? qs.stringify(data) : data;
  }
  if (!isEmpty(headers)) {
    opts.headers = headers;
  }
  return axios(opts).then((res) => {
    if (!res || !res.data) {
      return Promise.reject(res);
    }
    const { data } = res;
    if (has(data, 'error') && Number(data.error) !== 0) {
      return Promise.reject(data);
    }
    if (has(data, 'state') && Number(data.state) !== 0) {
      return Promise.reject(data);
    }
    if (typeof data === 'string' && /^\s*<!doctype html>/i.test(data)) {
      return Promise.reject(data);
    }
    return data;
  });
}
