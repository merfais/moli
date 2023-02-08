<script setup>
import {
  computed,
  unref,
} from 'vue';
import {
  get,
  set,
  omit,
} from 'lodash-es';
import compMap from '@/canvas-components/comp';
import {
  useCanvasEditorStore,
  updateLayout,
} from '../use-canvas-store';

const props = defineProps({
  i: String,
});

const store = useCanvasEditorStore();

const compKey = computed(() => get(store.viewMap, [props.i, 'compKey']));
const compProps = computed(() => {
  const viewConf = get(store.viewMap, props.i) || {};
  return omit(unref(viewConf), [
    'withLabel',
  ]);
});
const label = computed(() => {
  const viewConf = get(store.viewMap, props.i) || {};
  return viewConf.withLabel && viewConf.label;
});
const compWrapperClass = computed(() => {
  const viewConf = get(store.viewMap, props.i) || {};
  if (viewConf.labelPos === 'left') {
    return [
      'align-center',
    ];
  }
  return {
  };
});

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
  <div v-if="compMap[compKey] && label"
    :class="compWrapperClass"
    >
    <div class="flex-0-0">{{label}}：</div>
    <component
      :is="compMap[compKey]"
      v-bind="compProps"
      @update:value="onUpdateValue"
      @update:ds="onUpdateDataSource"
      @update:focused="onFocused"
    />
  </div>
  <component v-else-if="compMap[compKey]"
    :is="compMap[compKey]"
    v-bind="compProps"
    @update:value="onUpdateValue"
    @update:ds="onUpdateDataSource"
    @update:focused="onFocused"
  />
  <div v-else>未支持的组件</div>
</template>
<style scoped>
</style>
