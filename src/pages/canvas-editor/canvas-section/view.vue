<script setup>
import {
  computed,
} from 'vue';
import {
  get,
  set,
} from 'lodash-es';
import compMap from '@/canvas-components/comp';
import {
  useCanvasEditorStore,
} from '../use-canvas-editor';

const props = defineProps({
  i: String,
});

const store = useCanvasEditorStore();

const comp = computed(() => get(store.viewMap, props.i) || {});

const compWrapperClass = computed(() => {
  return {};
});

function onUpdateValue(value) {
  // const compProps = get(store.viewMap, [props.i, 'compProps']) || {}
  set(store.viewMap, [props.i, 'compProps', value], value);
}

function onUpdateVar() {

}

</script>
<template>
  <div v-if="compMap[comp.compKey] && comp.label"
    :class="compWrapperClass"
    >
    <div>{{comp.label}}</div>
    <component
      :is="compMap[comp.compKey]"
      class="comp"
      v-bind="comp.compProps"
      @update:value="onUpdateValue"
      @update:var="onUpdateVar"
    />
  </div>
  <component v-else-if="compMap[comp.compKey]"
    :is="compMap[comp.compKey]"
    class="comp"
    v-bind="comp.compProps"
    @update:value="onUpdateValue"
    @update:var="onUpdateVar"
  />
  <div v-else>未支持的组件</div>
</template>
<style scoped>
</style>
