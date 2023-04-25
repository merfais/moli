import {
  forEach,
  map,
} from 'lodash-es';
import {
  markRaw,
  onBeforeUnmount,
} from 'vue';
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

export function destroyEditorDSPool() {
  const store = useDSPoolStore();
  if (store.editorDSPool?.destructor) {
    store.editorDSPool.destructor();
  }
  store.editorDSPool = {};
  store.editorDSIdList = [];
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

export function setEditorDSValue(...args) {
  const store = useDSPoolStore();
  if (store.editorDSPool?.setValue) {
    store.editorDSPool.setValue(...args);
  }
}

export function getEditorDSConfig(dsId) {
  const store = useDSPoolStore();
  if (dsId && store.editorDSPool?.getConfig) {
    return markRaw(store.editorDSPool.getConfig(dsId));
  }
  if (!dsId && store.editorDSPool.getDsConfig) {
    return markRaw(store.editorDSPool.getDsConfig());
  }
}

export function getEditorDSInfo() {
  const store = useDSPoolStore();
  return markRaw(map(store.editorDSPool.dsMap, item => {
    return {
      ...item.getConfig(),
      status: item.status,
      errMsg: item.errMsg,
    };
  }));
}

export function getEditorDSOpts(exclude) {
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

  return markRaw(list);
}

export function getEditorDSIdList() {
  const store = useDSPoolStore();
  return markRaw(Object.keys(store.editorDSPool.dsMap || {}));
}

export function getEditorDSValue(dsId) {
  const store = useDSPoolStore();
  if (store.editorDSPool?.dsMap?.[dsId]) {
    return store.editorDSPool.dsMap[dsId]?.value;
  }
}

export function watchEditorDS(...args) {
  const store = useDSPoolStore();
  const unwatch = store.editorDSPool.subscribe(...args);
  onBeforeUnmount(() => {
    unwatch();
  });
}


