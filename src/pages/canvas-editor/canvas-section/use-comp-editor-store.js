import { defineStore } from 'pinia';

export default defineStore({
  id: 'canvasCompEditor',
  state: () => ({
    visible: false,
    title: '修改',
    // 是否是克隆
    clone: false,
    loading: false,
    i: undefined,
    compKey: undefined,
    viewConf: {},
  }),
  getters: {
  },
});

