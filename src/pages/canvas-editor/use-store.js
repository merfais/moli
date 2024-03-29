import { defineStore } from 'pinia';
import { DATA_SOURCE_TYPE } from '@/data-source-pool';

export const useCanvasEditorStore = defineStore({
  id: 'canvasEditor',
  state: () => ({
    // 画布编辑类型， 新建create，修改update
    editType: 'create',
    // 是否是克隆
    clone: false,
    loading: false,
    baseInfo: {
      name: '我的画布',
      device: 'pc',
      width: 1440,
      height: 1000,
    },
    viewMap: {},
    pcLayoutMap: {
      root: [],
    },
    h5LayoutMap: {
      root: [],
    },
    // 从左侧组件区拖拽出来的组件的key
    draggingCompKey: '',
  }),
  getters: {
    pcRootLayout(state) {
      return state?.pcLayoutMap?.root || [];
    },
    h5RootLayout(state) {
      return state?.h5LayoutMap?.root || [];
    },
  },
});

export const useCompEditorStore = defineStore({
  id: 'canvasCompEditor',
  state: () => ({
    visible: false,
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

export const useDataSourceEditorStore = defineStore({
  id: 'dataSourceEditor',
  state: () => ({
    visible: false,
    uid: undefined,
    editType: 'create',
    title: '新建数据源',
    // 是否是克隆
    clone: false,
    loading: false,
    form: {},
    formItems: {},
    record: {
      type: DATA_SOURCE_TYPE.JS_FUNCTION,
    },
  }),
  getters: {
  },
});

