import {
  get,
  set,
  cloneDeep,
  forEach,
} from 'lodash-es';
import {
  getEditorDSConfig,
} from '@/stores/ds-pool';
import {
  useCanvasEditorStore,
} from '../use-canvas-store';
import { useCompEditorStore } from './use-store';

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
  compEditorStore.dataSource = {};

  forEach(viewConf.exportDSs, (dsId, index) => {
    const dsConf = getEditorDSConfig(dsId);
    if (!dsConf) {
      return;
    }
    set(compEditorStore, ['dataSource', `exportDS${index + 1}`], dsConf);
  });
}

