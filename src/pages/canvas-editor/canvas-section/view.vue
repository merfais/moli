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
} from '../use-canvas-editor';

const props = defineProps({
  i: String,
});

const store = useCanvasEditorStore();

const compKey = computed(() => get(store.viewMap, [props.i, 'compKey']));
const compProps = computed(() => {
  const comp = get(store.viewMap, props.i) || {};
  return omit(unref(comp), [
    'withLabel',
  ]);
});
const label = computed(() => {
  const comp = get(store.viewMap, props.i) || {};
  return comp.withLabel && comp.label;
});
const compWrapperClass = computed(() => {
  const comp = get(store.viewMap, props.i) || {};
  if (comp.labelPos === 'left') {
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

function onUpdateVar() {

}

</script>
<template>
  <div v-if="compMap[compKey] && label"
    :class="compWrapperClass"
    >
    <div>{{label}}：</div>
    <component
      :is="compMap[compKey]"
      class="comp"
      v-bind="compProps"
      @update:value="onUpdateValue"
      @update:var="onUpdateVar"
    />
  </div>
  <component v-else-if="compMap[compKey]"
    :is="compMap[compKey]"
    class="comp"
    v-bind="compProps"
    @update:value="onUpdateValue"
    @update:var="onUpdateVar"
  />
  <div v-else>未支持的组件</div>
</template>
<style scoped>
</style>
