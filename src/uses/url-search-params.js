import { forEach } from 'lodash-es';

export default function useUrlSearchParams(key, search) {
  let convertMap = {};
  let keys = [];
  if (Array.isArray(key)) {
    keys = key;
  } else if (typeof key === 'object') {
    convertMap = key;
    keys = Object.keys(key);
  } else if (key) {
    keys = [key];
  }
  let searchParams;
  if (search instanceof window.URLSearchParams) {
    searchParams = search;
  } else if (typeof search === 'string') {
    searchParams = new window.URLSearchParams(search);
  } else {
    searchParams = new window.URLSearchParams(window.location.search);
  }
  if (!keys.length) {
    keys = [...searchParams.keys()];
  }
  const result = {};
  forEach(keys, (key) => {
    const value = searchParams.getAll(key);
    if (value === null || !value?.length) {
      return;
    }
    if (convertMap[key] === Array) {
      result[key] = value;
    } else if (typeof convertMap[key] === 'function') {
      result[key] = convertMap[key](value);
    } else {
      result[key] = value.length === 1 ? value[0] : value;
    }
  });
  return result;
}
