import { defineStore } from 'pinia';

export const useCompEditorStore = defineStore({
  id: 'canvasCompEditor',
  state: () => ({
    visible: false,
    title: '修改',
    // 是否是克隆
    clone: false,
    loading: false,
    i: undefined,
    index: -1,
    compKey: undefined,
    viewConf: {},
    dataSource: {},
    pcLayout: {},
  }),
  getters: {
  },
});

