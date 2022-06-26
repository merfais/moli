import { forEach } from 'lodash-es';

export default function useUrlSearchParams(...args) {
  let convertMap = {};
  let keys = args;
  if (args.length === 1) {
    const [key] = args;
    if (Array.isArray(key)) {
      keys = key;
    } else if (typeof key === 'object') {
      convertMap = key;
      keys = Object.keys(key);
    } else {
      keys = [key];
    }
  }
  const searchParams = new URLSearchParams(window.location.search);
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
