import {
  get,
  cloneDeep,
} from 'lodash-es';
import {
  useCanvasEditorStore,
} from '../use-canvas-editor';
import useCompEditorStore from './use-store';

export function onClickSetting(i) {
  const viewStore = useCompEditorStore();
  viewStore.visible = true;
  viewStore.title = '修改配置';
  viewStore.i = i;

  const canvasStore = useCanvasEditorStore();
  const comp = get(canvasStore.viewMap, i) || {};
  viewStore.viewConf = cloneDeep(comp);
  viewStore.compKey = comp?.compKey;
}

