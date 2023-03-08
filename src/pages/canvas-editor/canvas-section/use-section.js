import {
  get,
  set,
  cloneDeep,
  forEach,
} from 'lodash-es';
import {
  useCanvasEditorStore,
} from '../use-canvas-store';
import useCompEditorStore from './use-comp-editor-store';

export function onClickSetting(i, index) {
  const compEditorStore = useCompEditorStore();
  compEditorStore.visible = true;
  compEditorStore.title = '修改配置';
  compEditorStore.i = i;
  compEditorStore.index = index;

  const canvasStore = useCanvasEditorStore();
  const viewConf = get(canvasStore.viewMap, i) || {};
  compEditorStore.viewConf = cloneDeep(viewConf);
  compEditorStore.compKey = viewConf?.compKey;
  compEditorStore.pcLayout = cloneDeep(get(canvasStore.pcMainLayoutArr, [index]));
  compEditorStore.dsPool = canvasStore.dsPool;

  forEach(viewConf.exportDSs, (dsId, index) => {
    if (!canvasStore.dsPool?.getConfig) {
      return;
    }
    const dsConf = canvasStore.dsPool.getConfig(dsId);
    set(compEditorStore, ['dataSource', `exportDS${index + 1}`], dsConf);
  });
}

