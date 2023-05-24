<script setup>
import {
  computed,
  unref,
  ref,
} from 'vue';
import {
  get,
  set,
  omit,
} from 'lodash-es';
import {
  COMP_KEY,
  compMap,
} from '@/canvas-components';
import {
  setEditorDSValue,
} from '@/stores/ds-pool';
import {
  useCanvasEditorStore,
} from './use-store';
import {
  updateLayout,
} from './use-canvas';

const props = defineProps({
  i: String,
});

const canvasStore = useCanvasEditorStore();

const domRef = ref();

const compKey = computed(() => get(canvasStore.viewMap, [props.i, 'compKey']));
const compProps = computed(() => {
  const viewConf = unref(get(canvasStore.viewMap, props.i) || {});
  const propObj = omit(viewConf, [
    'withLabel',
    'labelPos',
    'valueType',
    'compName',
    'compKey',
    'exportDSs',
    'name',
    'i',
  ]);
  propObj.id = props.i;
  // TODO: 挂载点
  if (unref(compKey) === COMP_KEY.SELECT) {
    propObj.getPopupContainer = getPopupContainer;
  }

  return propObj;
});

const label = computed(() => {
  const viewConf = get(canvasStore.viewMap, props.i) || {};
  return viewConf.withLabel && viewConf.label;
});

const compWrapperClass = computed(() => {
  const viewConf = get(canvasStore.viewMap, props.i) || {};
  if (unref(label)) {
    return viewConf.labelPos === 'left' ? 'align-center' : 'flex-column';
  }
  return 'd-flex';
});

function getPopupContainer() {
  return unref(domRef);
}

function onUpdateValue(value) {
  // const compProps = get(canvasStore.viewMap, [props.i, 'compProps']) || {}
  set(canvasStore.viewMap, [props.i, 'value'], value);
}

function onUpdateDataSource(options = {}) {
  setEditorDSValue(options);
}

function onFocused(focused) {
  updateLayout({
    i: props.i,
    isDraggable: !focused,
  });
}

</script>
<template>
  <div v-if="compMap[compKey]"
    ref="domRef"
    :class="compWrapperClass"
    >
    <div v-if="label" class="flex-0-0">{{label}}：</div>
    <component
      :is="compMap[compKey]"
      v-bind="compProps"
      @update:value="onUpdateValue"
      @update:ds="onUpdateDataSource"
      @update:focused="onFocused"
    />
  </div>
  <div v-else>未支持的组件</div>
</template>
<style scoped>
</style>
