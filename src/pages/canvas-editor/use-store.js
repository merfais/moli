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
      name: '我我的画布我的画布我的画布我的画布我的画布的画布',
      device: 'pc',
      width: 1440,
      height: 1000,
    },
    viewMap: {},
    pcMainLayoutArr: [],
    pcSubLayoutMap: {},
    // 从左侧组件区拖拽出来的组件的key
    draggingCompKey: '',
  }),
  getters: {
  },
});

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

export const useDataSourceEditorStore = defineStore({
  id: 'dataSourceEditor',
  state: () => ({
    visible: false,
    title: '新建数据源',
    // 是否是克隆
    clone: false,
    loading: false,
    formItems: {},
    record: {
      type: DATA_SOURCE_TYPE.JS_FUNCTION,
    },
  }),
  getters: {
  },
});

