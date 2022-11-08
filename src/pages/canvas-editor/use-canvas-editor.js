import { defineStore } from 'pinia';

export const useCanvasEditorStore = defineStore({
  id: 'canvasEditor',
  state: () => ({
    editType: 'create',
    clone: false,
    loading: false,
    baseInfo: {
      name: '我我的画布我的画布我的画布我的画布我的画布的画布',
    },
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

