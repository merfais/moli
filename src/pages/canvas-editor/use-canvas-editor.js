import { defineStore } from 'pinia';

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
    // 从左侧组件区拖拽出来的组件的key
    draggingCompKey: '',
  }),
  getters: {
  },
});

export async function init() {
  const store = useCanvasEditorStore();
  store.loading = true;
  // TODO:
  store.loading = false;
}

export async function save() {
  const store = useCanvasEditorStore();
  store.loading = true;
  // TODO:
  store.loading = false;
}

