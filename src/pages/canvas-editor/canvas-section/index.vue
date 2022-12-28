<script setup>
import {
  computed,
  ref,
  unref,
  nextTick,
} from 'vue';
import {
  get,
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
} from '../use-canvas-editor';
import {
  onClickSetting,
} from './use-editor';
import Toolbar from './toolbar';
import View from './view';
import Editor from './editor';

let draggingLayout = null;
let draggingConf = {};

const store = useCanvasEditorStore();

const canvasDomRef = ref();
const gridLayoutRef = ref();
const gridItemsRef = ref();
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


// function getView() {
//
// }
//
// function getVariables() {
//
// }
//
// function registerViewVariable() {
//
// }
//
// function mergeState() {
//
// }

async function onDragenter(e) {
  const { layout, dftConf } = await getCompConfig(store.draggingCompKey);

  draggingConf = dftConf;

  const device = get(store, 'baseInfo.device') || 'pc';
  const { w, h } = get(layout, device) || {};

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
  if (!draggingLayout) {
    return;
  }
  // 隐藏vue-grid-layout的placeholder
  const { i, x, y, h, w } = draggingLayout;
  const { emitter } = unref(gridLayoutRef) || {};
  emitter.emit('dragEvent', ['dragend', i, x, y, h, w]);

  removeLayout(draggingLayout);
  const newI = newId();
  addLayout({ ...draggingLayout, i: newI });
  addView({
    i: newI,
    compKey: store.draggingCompKey,
    ...draggingConf,
  });
  onClickSetting(newI);

  // // 构造完整view config
  // const view = getView(store.draggingCompKey);
  // const variables = getVariables(store.draggingCompKey);
  // view.id = id;
  // forEach(variables, item => {
  //   const key = `${view.key}_${id}_${item.key}`;
  //   const name = `${view.name}${id}的${item.name}`;
  //   view.variables.push(key);
  //   registerViewVariable({
  //     ...item,
  //     key,
  //     name,
  //   });
  // });
  // mergeState(['viewMap', { [id]: view }]);

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
  <div class="canvas-section p-20 height-100 overflow-auto">
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
        :verticalCompact="false"
        :autoSize="false"
        @dragenter.self="onDragenter"
        @dragover.prevent="onDragover"
        @dragleave.self="onDragleave"
        @drop="onDrop"
      >
        <GridItem v-for="item in store.pcMainLayoutArr"
          :key="item.i"
          :id="`${item.i}_grid_item`"
          ref="gridItemsRef"
          class='grid-item-wrapper'
          v-bind="item"
          @move="onMove"
          @moved="onMoved"
        >
          <ATooltip
            placement="topRight"
            destroyTooltipOnHide
            :getPopupContainer="() => getToolbarPopupContainer(item)"
          >
            <template #title>
              <Toolbar :i="item.i" />
            </template>
            <View :i="item.i" />
          </ATooltip>
        </GridItem>
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

  }
}
</style>
