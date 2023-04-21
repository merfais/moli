import {
  forEach,
  map,
} from 'lodash-es';
import { markRaw } from 'vue';
import { defineStore } from 'pinia';
import { DataSourcePool } from '@/data-source-pool';

export const useDSPoolStore = defineStore({
  id: 'dsPool',
  state: () => ({
    editorDSPool: {},
    editorDSIdList: [],
  }),
  getters: {
  },
});

export function initEditorDSPool(dataSources) {
  const store = useDSPoolStore();
  store.editorDSPool = markRaw(new DataSourcePool(dataSources));
  store.editorDSPool.subscribe('*', () => {
    store.editorDSIdList = markRaw(Object.keys(store.editorDSPool.dsMap || {}));
  });
}

export function registerEditorDS(conf) {
  const store = useDSPoolStore();
  if (store.editorDSPool?.register) {
    store.editorDSPool.register(conf);
  }
}

export function unRegisterEditorDS(dsId) {
  const store = useDSPoolStore();
  if (store.editorDSPool?.unRegister) {
    store.editorDSPool.unRegister(dsId);
  }
}

export function updateEditorDS(conf) {
  const store = useDSPoolStore();
  if (store.editorDSPool?.update) {
    store.editorDSPool.update(conf);
  }
}

export function getEditorDSConfig(dsId) {
  const store = useDSPoolStore();
  if (dsId && store.editorDSPool?.getConfig) {
    return store.editorDSPool.getConfig(dsId);
  }
  if (!dsId && store.editorDSPool.getDsConfig) {
    return store.editorDSPool.getDsConfig();
  }
}

export function getEditorDSInfo() {
  const store = useDSPoolStore();
  return map(store.editorDSPool.dsMap, item => {
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      value: item.value,
      status: item.status,
      errMsg: item.errMsg,
    };
  });
}

export function getEditorDSList(exclude) {
  const store = useDSPoolStore();

  const list = [];

  forEach(store.editorDSIdList, (id) => {
    if (Array.isArray(exclude)) {
      if (exclude.indexOf(id) !== -1) {
        return;
      }
    } else if (exclude === id) {
      return;
    }
    const { name } = store.editorDSPool.dsMap[id] || {};
    list.push({ label: name, value: id });
  });

  return list;
}

export function getEditorDSValue(dsId) {
  const store = useDSPoolStore();
  if (store.editorDSPool?.dsMap?.[dsId]) {
    return store.editorDSPool.dsMap[dsId]?.value;
  }
}

