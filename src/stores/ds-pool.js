import { markRaw } from 'vue';
import { defineStore } from 'pinia';
import { DataSourcePool } from '@/data-source-pool';

export const useDSPoolStore = defineStore({
  id: 'dsPool',
  state: () => ({
    editorDSPool: {},
  }),
  getters: {
  },
});

export function initEditorDSPool() {
  const store = useDSPoolStore();
  store.editorDSPool = markRaw(new DataSourcePool());
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
  if (store.editorDSPool?.getConfig) {
    return store.editorDSPool.getConfig(dsId);
  }
}

export function getEditorDSList(exclude) {
  const store = useDSPoolStore();
  if (store.editorDSPool?.getDSList) {
    return store.editorDSPool.getDSList(exclude);
  }
}
export function getEditorDSValue(dsId) {
  const store = useDSPoolStore();
  if (store.editorDSPool?.dsMap) {
    return store.editorDSPool.dsMap[dsId]?.value;
  }
}

