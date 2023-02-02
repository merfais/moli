import {
  get,
  cloneDeep,
  forEach,
} from 'lodash-es';
import {
  useCanvasEditorStore,
} from '../use-canvas-store';
import useCompEditorStore from './use-comp-editor-store';

export function onClickSetting(i) {
  const viewStore = useCompEditorStore();
  viewStore.visible = true;
  viewStore.title = '修改配置';
  viewStore.i = i;

  const canvasStore = useCanvasEditorStore();
  const comp = get(canvasStore.viewMap, i) || {};
  viewStore.viewConf = cloneDeep(comp);
  viewStore.compKey = comp?.compKey;

  forEach(comp.exportDSs, (dsId, index) => {
    if (!canvasStore.dsPool?.getConfig) {
      return;
    }
    const dsConf = canvasStore.dsPool.getConfig(dsId);
    viewStore.dataSource[`exportDS${index + 1}`] = dsConf;
  });
}

