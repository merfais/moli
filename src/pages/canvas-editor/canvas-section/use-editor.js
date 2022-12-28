import {
  get,
} from 'lodash-es';
import { defineStore } from 'pinia';
import {
  useCanvasEditorStore,
} from '../use-canvas-editor';

export const useViewEditorStore = defineStore({
  id: 'viewEditor',
  state: () => ({
    visible: false,
    title: '修改',
    // 是否是克隆
    clone: false,
    loading: false,
    i: undefined,
    viewConf: {},
  }),
  getters: {
  },
});

export function onClickSetting(i) {
  const viewStore = useViewEditorStore();
  viewStore.visible = true;
  viewStore.title = '修改配置';
  viewStore.i = i;

  const canvasStore = useCanvasEditorStore();
  const comp = get(canvasStore.viewMap, i) || {};
  viewStore.viewConf = comp;
}

