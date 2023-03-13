import {
  forEach,
} from 'lodash-es';
import {
  reactive,
} from 'vue';
import useUrlSearchParams from '@/uses/url-search-params';
import router from '@/router';

export default function useUrlFilter(fields) {
  const urlFilters = reactive({});

  function setUrlFilters(query) {
    router.push({ query: { ...urlFilters, ...query } });
  }

  function getUrlFilters() {
    forEach(urlFilters, (_, key) => {
      delete urlFilters[key];
    });
    Object.assign(urlFilters, useUrlSearchParams(fields));
    return urlFilters;
  }

  getUrlFilters();

  return {
    urlFilters,
    setUrlFilters,
    getUrlFilters,
  };
}

