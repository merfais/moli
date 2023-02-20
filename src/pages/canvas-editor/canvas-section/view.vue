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
  useCanvasEditorStore,
  updateLayout,
} from '../use-canvas-store';

const props = defineProps({
  i: String,
});

const store = useCanvasEditorStore();

const domRef = ref();

const compKey = computed(() => get(store.viewMap, [props.i, 'compKey']));
const compProps = computed(() => {
  const viewConf = unref(get(store.viewMap, props.i) || {});
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
  if (unref(compKey) === COMP_KEY.SELECT) {
    propObj.getPopupContainer = getPopupContainer;
  }

  return propObj;
});

const label = computed(() => {
  const viewConf = get(store.viewMap, props.i) || {};
  return viewConf.withLabel && viewConf.label;
});

const compWrapperClass = computed(() => {
  const viewConf = get(store.viewMap, props.i) || {};
  if (unref(label)) {
    return viewConf.labelPos === 'left' ? 'align-center' : 'flex-column';
  }
  return 'd-flex';
});

function getPopupContainer() {
  return unref(domRef);
}

function onUpdateValue(value) {
  // const compProps = get(store.viewMap, [props.i, 'compProps']) || {}
  set(store.viewMap, [props.i, 'value'], value);
}

function onUpdateDataSource() {
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
      :options="[{label: 'l', value: 'v'}]"
      @update:value="onUpdateValue"
      @update:ds="onUpdateDataSource"
      @update:focused="onFocused"
    />
  </div>
  <div v-else>未支持的组件</div>
</template>
<style scoped>
</style>
