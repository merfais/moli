import {
  filter,
  findIndex,
  get,
  set,
  cloneDeep,
  forEach,
} from 'lodash-es';
import { message } from 'ant-design-vue';
import {
  getEditorDSConfig,
  initEditorDSPool,
  unRegisterEditorDS,
} from '@/stores/ds-pool';
import {
  useCompEditorStore,
  useCanvasEditorStore,
} from './use-store';

export async function init() {
  const store = useCanvasEditorStore();
  store.loading = true;
  // TODO:
  initEditorDSPool();
  store.loading = false;
}

export async function save() {
  const store = useCanvasEditorStore();
  store.loading = true;
  // TODO:
  store.loading = false;
}

export function addLayout(layoutItem) {
  const store = useCanvasEditorStore();
  const arr = [...store.pcMainLayoutArr];
  arr.push(layoutItem);
  store.pcMainLayoutArr = arr;
}

export function removeLayout(layoutItem) {
  const store = useCanvasEditorStore();
  store.pcMainLayoutArr = filter(store.pcMainLayoutArr, item => {
    return item.i !== layoutItem.i;
  });
}

export function updateLayout(layoutItem) {
  const store = useCanvasEditorStore();
  const arr = [...store.pcMainLayoutArr];
  const index = findIndex(arr, { i: layoutItem.i });
  if (index !== -1) {
    arr.splice(index, 1, {
      ...arr[index],
      ...layoutItem,
    });
  }
  store.pcMainLayoutArr = arr;
}

export function addView(conf = {}) {
  const store = useCanvasEditorStore();
  const { i } = conf;
  store.viewMap[i] = conf;
}

export function removeView(i) {
  const store = useCanvasEditorStore();
  const comp = get(store.viewMap, i);
  if (!comp) {
    message.warn('删除失败');
    return;
  }
  delete store.viewMap[i];
  removeLayout({ i });

  const { exportDSs } = comp;
  forEach(exportDSs, dsId => {
    unRegisterEditorDS(dsId);
  });
}

export function updateView() {

}


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

