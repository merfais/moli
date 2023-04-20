import {
  filter,
  findIndex,
  get,
  set,
  cloneDeep,
  forEach,
  omit,
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
  loadConf(res);
  store.id = id;
  store.editType = 'update';
  store.loading = false;
}

function loadConf(conf) {
  const store = useCanvasEditorStore();
  const { baseInfo } = conf;
  Object.assign(store.baseInfo, baseInfo || {});
  const { pcLayoutMap, h5LayoutMap } = conf;
  forEach(pcLayoutMap, (item, key) => {
    store.pcLayoutMap[key] = Array.isArray(item) ? item : [];
  });
  forEach(h5LayoutMap, (item, key) => {
    store.h5LayoutMap[key] = Array.isArray(item) ? item : [];
  });
  if (!store.pcLayoutMap.root) {
    store.pcLayoutMap.root = [];
  }
  if (!store.h5LayoutMap.root) {
    store.h5LayoutMap.root = [];
  }
  store.viewMap = conf.viewMap || {};
  initEditorDSPool(conf.dataSources);
}

export async function save() {
  const store = useCanvasEditorStore();
  store.loading = true;
  const info = formatConf();
  const data = {
    id: store.id,
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

function formatConf() {
  const store = useCanvasEditorStore();
  const info = {
    dataSources: {},
    baseInfo: store.baseInfo,
    pcLayoutMap: {},
    h5LayoutMap: {},
    viewMap: {},
  };

  const oldDS = getEditorDSConfig();
  forEach(oldDS, (item, key) => {
    // 过滤掉组件导出的数据源
    // if (item.type) {
    //   return
    // }

    // 只保留自定义的数据源
    info.dataSources[key] = item;
  });

  serialize({ ...info, oldDS, layoutType: 'pcLayoutMap', layoutKey: 'root' });
  serialize({ ...info, oldDS, layoutType: 'h5LayoutMap', layoutKey: 'root' });

  return info;
}

function serialize(options = {}) {
  const store = useCanvasEditorStore();
  const arr = [];
  const { layoutType, layoutKey } = options;
  forEach(get(store, [layoutType, layoutKey]), (oldItem) => {
    const view = store.viewMap?.[oldItem.i];
    if (!view) {
      return;
    }
    const item = omit(oldItem, ['moved']);
    if (get(store, [layoutType, item.i, 'length'])) {
      serialize({ ...options, layoutKey: item.i });
    }
    forEach(view?.exportDSs, key => {
      set(options.dataSources, key, options.oldDS[key]);
    });

    set(options.viewMap, item.i, view);
    arr.push(item);
  });
  set(options[layoutType], layoutKey, arr);
}

export function addLayout(layoutItem) {
  const store = useCanvasEditorStore();
  const arr = [...store.pcRootLayout];
  arr.push(layoutItem);
  store.pcLayoutMap.root = arr;
}

export function removeLayout(layoutItem) {
  const store = useCanvasEditorStore();
  store.pcLayoutMap.root = filter(store.pcRootLayout, item => {
    return item.i !== layoutItem.i;
  });
}

export function updateLayout(layoutItem) {
  const store = useCanvasEditorStore();
  const arr = [...store.pcRootLayout];
  const index = findIndex(arr, { i: layoutItem.i });
  if (index !== -1) {
    arr.splice(index, 1, {
      ...arr[index],
      ...layoutItem,
    });
  }
  store.pcLayoutMap.root = arr;
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
  compEditorStore.pcLayout = cloneDeep(get(canvasStore.pcRootLayout, [index]));
  compEditorStore.dataSource = {};

  forEach(viewConf.exportDSs, (dsId, index) => {
    const dsConf = getEditorDSConfig(dsId);
    if (!dsConf) {
      return;
    }
    set(compEditorStore, ['dataSource', `exportDS${index + 1}`], dsConf);
  });
}

