<script setup>
import {
  computed,
  ref,
  unref,
  nextTick,
} from 'vue';
import {
  get,
  forEach,
} from 'lodash-es';
import newId from '@/uses/id';
import {
  getCompConfig,
} from '@/canvas-components';
import {
  useCanvasEditorStore,
  addLayout,
  removeLayout,
  addView,
  init,
} from '../use-canvas-store';
import {
  onClickSetting,
} from './use-section';
import Toolbar from './toolbar';
import View from './view';
import Editor from './editor';

let draggingLayout = null;
let draggingConf = {};

const store = useCanvasEditorStore();

init();

const canvasDomRef = ref();
const gridLayoutRef = ref();
const gridItemsRef = ref();
const gridItemsClass = ref('');
const contentStyle = computed(() => {
  const { height, width } = store.baseInfo || {};
  return {
    width: `${width}px`,
    height: `${height}px`,
  };
});
const colNum = computed(() => {
  const { width } = store.baseInfo || {};
  return width;
});

async function onDragenter(e) {
  draggingConf = await getCompConfig(store.draggingCompKey);

  gridItemsClass.value = 'dragging';

  const device = get(store, 'baseInfo.device') || 'pc';
  const { w, h } = get(draggingConf.layout, device) || {};

  draggingLayout = {
    i: newId(),
    ...draggingLayout,
    x: e.offsetX,
    y: e.offsetY,
    w,
    h,
  };
  removeLayout(draggingLayout);
  addLayout(draggingLayout);

  await nextTick();
  const latestRef = unref(gridItemsRef).slice(-1).pop() || {};
  const draggingDomRef = unref(latestRef.domRef);
  try {
    // 隐藏正在拖拽的dom
    draggingDomRef.style.display = 'none';
  } catch (e) {
    // 忽略
  }
}

function onDragleave(e) {
  gridItemsClass.value = '';
  const { relatedTarget } = e;
  if (unref(canvasDomRef).contains(relatedTarget) || !draggingLayout) {
    return;
  }
  const { i, x, y, h, w } = draggingLayout;
  const { emitter } = unref(gridLayoutRef) || {};
  emitter.emit('dragEvent', ['dragend', i, x, y, h, w]);
  removeLayout(draggingLayout);
  draggingLayout = null;
}

function onDragover(e) {
  if (!unref(canvasDomRef) || !draggingLayout) {
    return;
  }
  // TODO: 节流
  const { i, h, w } = draggingLayout;
  // TODO
  // const children = _.get(this.$refs, 'gridlayout.$children', []);
  // if (children.length < 2) {
  //   return;
  // }
  const { clientX, clientY } = e;
  const wrapperRect = unref(canvasDomRef)?.getBoundingClientRect();
  const { top: pTop, left: pLeft } = wrapperRect;
  const top = clientY - pTop;
  const left = clientX - pLeft;
  const { placeholderRef, emitter } = unref(gridLayoutRef) || {};
  const calcXY = get(unref(placeholderRef), 'calcXY');
  if (calcXY) {
    const { x, y } = calcXY(top, left);
    emitter.emit('dragEvent', ['dragmove', i, x, y, h, w]);
  }
}

function onDrop() {
  gridItemsClass.value = '';
  if (!draggingLayout) {
    return;
  }
  // 隐藏vue-grid-layout的placeholder
  const { i, x, y, h, w } = draggingLayout;
  const { emitter } = unref(gridLayoutRef) || {};
  emitter.emit('dragEvent', ['dragend', i, x, y, h, w]);

  removeLayout(draggingLayout);

  const device = get(store, 'baseInfo.device') || 'pc';
  const viewConf = {
    i: newId(),
    name: draggingConf.name,
    compKey: store.draggingCompKey,
    ...draggingConf.dftConf,
    exportDSs: [],
    style: get(draggingConf.style, device) || {},
  };
  forEach(draggingConf.dataSource, (item, index) => {
    const { idPrefix, ...restConf } = item;
    const id = newId(item.idPrefix, 6);
    const name = `${viewConf.name}${id}`;

    viewConf.exportDSs = [id];
    const k = `exportDS${index + 1}`;
    viewConf[k] = id;

    store.dsPool.register({
      id,
      name,
      valueType: viewConf.valueType,
      ...restConf,
    });
  });
  addView(viewConf);
  addLayout({ ...draggingLayout, i: viewConf.i });
  const len = store.pcMainLayoutArr?.length || 0;
  onClickSetting(viewConf.i, len - 1);

  // 清理临时数据
  store.draggingCompKey = null;
  draggingLayout = null;
  draggingConf = {};
}

function onMove() {

}

function onMoved() {

}

function getToolbarPopupContainer(item) {
  return document.querySelector(`#${item.i}_grid_item`);
}

</script>
<template>
  <div class="canvas-section p-20-10 height-100 overflow-auto">
    <div id="canvas_content"
      ref="canvasDomRef"
      class="canvas-bg height-100"
      :style="contentStyle"
    >
      <GridLayout
        class='grid-layout-wrapper height-100'
        ref="gridLayoutRef"
        v-model:layout="store.pcMainLayoutArr"
        :colNum="colNum"
        :rowHeight="1"
        :margin="[0, 0]"
        isDraggable
        isResizable
        :autoSize="false"
        :verticalCompact="false"
        @dragenter.self="onDragenter"
        @dragover.prevent="onDragover"
        @dragleave.self="onDragleave"
        @drop.stop="onDrop"
      >
        <template v-for="(item, index) in store.pcMainLayoutArr" :key="item.i">
          <ATooltip
            placement="topRight"
            destroyTooltipOnHide
            :getPopupContainer="() => getToolbarPopupContainer(item)"
          >
            <template #title>
              <Toolbar :i="item.i" :index="index" />
            </template>
            <GridItem
              :id="`${item.i}_grid_item`"
              ref="gridItemsRef"
              class='grid-item-wrapper'
              :class="gridItemsClass"
              v-bind="item"
              @move="onMove"
              @moved="onMoved"
            >
              <View :i="item.i" />
            </GridItem>
          </ATooltip>
        </template>
      </GridLayout>
    </div>
    <Editor />
  </div>
</template>
<style scoped>
.canvas-section {
  background: #fafafa;

  .canvas-bg {
    background: linear-gradient(transparent 9px, #E1E4EA 10px),
                linear-gradient(90deg, transparent 9px, #E1E4EA 10px),
                linear-gradient(90deg, transparent 49px, rgba(0, 0, 0, .1) 50px),
                linear-gradient(transparent 49px, rgba(0, 0, 0, .1) 50px),
                #FcFcFc;
    background-size: 10px 10px, 10px 10px, 50px 50px, 50px 50px;
    box-shadow: 0 0 10px 1px #E1E4EA, 0 0 15px 1px #E1E4EA;
    transition: all .5s;
    margin: 0 auto;
  }

  :deep(.vue-grid-layout) {
    height: 100%;

    .vue-grid-placeholder {
      pointer-events: none;
    }
  }

  :deep(.ant-tooltip-content) {
    .ant-tooltip-arrow {
      display: none;
    }

    .ant-tooltip-inner {
      padding: 0;
      background: transparent;
      min-height: unset;
      min-width: unset;
      box-shadow: unset;
    }
  }

  .grid-item-wrapper {
    &:hover {
      box-shadow: 0 0 1px 1px #0E73FF;
    }

    &.dragging {
      pointer-events: none;
    }
  }
}
</style>
