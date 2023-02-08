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
  const viewStore = useCompEditorStore();
  viewStore.visible = true;
  viewStore.title = '修改配置';
  viewStore.i = i;
  viewStore.index = index;

  const canvasStore = useCanvasEditorStore();
  const viewConf = get(canvasStore.viewMap, i) || {};
  viewStore.viewConf = cloneDeep(viewConf);
  viewStore.compKey = viewConf?.compKey;
  viewStore.pcLayout = cloneDeep(get(canvasStore.pcMainLayoutArr, [index]));

  forEach(viewConf.exportDSs, (dsId, index) => {
    if (!canvasStore.dsPool?.getConfig) {
      return;
    }
    const dsConf = canvasStore.dsPool.getConfig(dsId);
    set(viewStore, ['dataSource', `exportDS${index + 1}`], dsConf);
  });
}

