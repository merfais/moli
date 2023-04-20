import {
  filter,
  findIndex,
  get,
  set,
  cloneDeep,
  forEach,
  pick,
} from 'lodash-es';
import {
  unref,
} from 'vue';
import { message } from 'ant-design-vue';
import newId from '@/uses/id';
import { errorLog } from '@/uses/log';
import router from '@/router';
import {
  getCanvas,
  saveCanvas,
} from '@/network';
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
  store.$reset();
  const route = unref(router.currentRoute);
  let id = route.params?.id;

  // 新建
  if (!id) {
    id = newId(16);
    store.id = id;
    store.editType = 'create';
    initEditorDSPool();
    router.push({ params: { id } });
    return;
  }

  // 修改
  store.loading = true;
  let res;
  try {
    res = await getCanvas(id);
  } catch (e) {
    errorLog({ e, msg: '获取页面配置失败' });
  }
  try {
    res = res?.info || '{}';
    res = JSON.parse(res);
  } catch (e) {
    errorLog({ e, msg: '解析页面配置出错' });
  }
  const { baseInfo = {}, dsPool, ...rest } = res;
  Object.assign(store.baseInfo, baseInfo);
  forEach(rest, (item, key) => {
    store[key] = item;
  });
  initEditorDSPool(dsPool);
  store.id = id;
  store.editType = 'update';
  store.loading = false;
}

export async function save() {
  const store = useCanvasEditorStore();
  store.loading = true;
  const info = pick(store, [
    'baseInfo',
    'pcMainLayoutArr',
    'pcSubLayoutMap',
    'viewMap',
  ]);

  info.dsPool = getEditorDSConfig();
  const { editType } = store;

  const data = {
    id: editType === 'create' ? newId(16) : store.id,
    info: JSON.stringify(info),
  };
  try {
    await saveCanvas(data);
    message.success('保存成功');
  } catch (e) {
    errorLog({ e, msg: '保存失败' });
  }
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

