<script setup>
import {
  computed,
  ref,
  unref,
  nextTick,
} from 'vue';
import {
  get,
  filter,
} from 'lodash-es';
import newId from '@/uses/id';
import {
  getCompConfig,
} from '@/canvas-components';
import Toolbar from './toolbar';
import {
  useCanvasEditorStore,
} from '../use-canvas-editor';

let draggingConf = null;

const store = useCanvasEditorStore();

const canvasDomRef = ref();
const gridLayoutRef = ref();
const gridItemsRef = ref();
const layoutArr = ref([]);
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

async function getLayout(compKey) {
  const { layout } = await getCompConfig(compKey);
  return get(layout, get(store, 'baseInfo.device') || 'pc') || {};
}

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

function addLayout(layoutItem) {
  const arr = [...unref(layoutArr)];
  arr.push(layoutItem);
  layoutArr.value = arr;
}

function removeLayout(layoutItem) {
  layoutArr.value = filter(unref(layoutArr), item => item.i !== layoutItem.i);
}

async function onDragenter(e) {
  draggingConf = {
    i: newId(),
    ...draggingConf,
    x: e.offsetX,
    y: e.offsetY,
    ...await getLayout(store.draggingCompKey),
  };
  removeLayout(draggingConf);
  addLayout(draggingConf);

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
  if (unref(canvasDomRef).contains(relatedTarget) || !draggingConf) {
    return;
  }
  const { i, x, y, h, w } = draggingConf;
  const { emitter } = unref(gridLayoutRef) || {};
  emitter.emit('dragEvent', ['dragend', i, x, y, h, w]);
  removeLayout(draggingConf);
  draggingConf = null;
}

function onDragover(e) {
  if (!unref(canvasDomRef) || !draggingConf) {
    return;
  }
  // TODO: 节流
  const { i, h, w } = draggingConf;
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
  if (!draggingConf) {
    return;
  }
  // 隐藏vue-grid-layout的placeholder
  const { i, x, y, h, w } = draggingConf;
  const { emitter } = unref(gridLayoutRef) || {};
  emitter.emit('dragEvent', ['dragend', i, x, y, h, w]);

  removeLayout(draggingConf);
  addLayout({ ...draggingConf, i: newId() });

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
  draggingConf = null;
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
        v-model:layout="layoutArr"
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
        <GridItem v-for="item in layoutArr"
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
              <Toolbar />
            </template>
            <div>{{item}}</div>
          </ATooltip>
        </GridItem>
      </GridLayout>
    </div>
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
