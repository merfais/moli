import {
  filter,
  findIndex,
} from 'lodash-es';
import { defineStore } from 'pinia';
import { DataSourcePool } from '@/data-source-pool';

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
    dsPool: {},
  }),
  getters: {
  },
});

export async function init() {
  const store = useCanvasEditorStore();
  store.loading = true;
  // TODO:
  store.dsPool = new DataSourcePool();
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

export function removeView() {

}

export function updateView() {

}


