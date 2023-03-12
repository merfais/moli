import {
  filter,
  findIndex,
  get,
  forEach,
} from 'lodash-es';
import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import {
  initEditorDSPool,
  unRegisterEditorDS,
} from '@/stores/ds-pool';

export const useCanvasEditorStore = defineStore({
  id: 'canvasEditor',
  state: () => ({
    // 画布编辑类型， 新建create，修改update
    editType: 'create',
    // 是否是克隆
    clone: false,
    loading: false,
    baseInfo: {
      name: '我我的画布我的画布我的画布我的画布我的画布的画布',
      device: 'pc',
      width: 1440,
      height: 1000,
    },
    viewMap: {},
    pcMainLayoutArr: [],
    pcSubLayoutMap: {},
    // 从左侧组件区拖拽出来的组件的key
    draggingCompKey: '',
  }),
  getters: {
  },
});

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


