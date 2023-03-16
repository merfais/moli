<script setup>
import {
  ref,
  onMounted,
  watch,
  reactive,
  unref,
  onBeforeUnmount,
} from 'vue';
import { editor } from 'monaco-editor';

const props = defineProps({
  value: String,
  language: String,
  options: Object,
  placeholder: String,
  completions: Array,
});

const emit = defineEmits([
  'inited',
  'input',
  'blue',
]);

defineExpose(exposeObj);

let editorIns;
let valueModel;
const dftOptions = {
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
};
const ro = new ResizeObserver(() => {
  resize();
});
const domRef = ref();
const exposeObj = reactive({
  resize,
  focus,
});

onMounted(() => {
  init();
  window.addEventListener('resize', resize);
  ro.observe(unref(domRef));
});

onBeforeUnmount(() => {
  dispose();
  window.removeEventListener('resize', resize);
  ro.disconnect();
});

watch(() => props.value, () => {
  if (valueModel && props.value !== valueModel.getValue()) {
    valueModel.setValue(props.value);
  }
}, { deep: true });

watch(() => props.options, () => {
  if (editorIns) {
    editorIns.updateOptions(props.options);
  }
}, { deep: true });

watch(() => props.language, () => {
  if (valueModel) {
    editor.setModelLanguage(valueModel, props.language);
  }
});

function dispose() {
  if (editorIns) {
    editorIns.dispose();
  }
}

function focus() {
  editorIns.focus();
}

function resize() {
  if (editorIns) {
    editorIns.layout();
  }
}

function init() {
  valueModel = editor.createModel(props.value, props.language);
  editorIns = editor.create(unref(domRef), {
    ...dftOptions,
    ...props.options,
  });
  editorIns.setModel(valueModel);

  editorIns.onDidChangeModelContent((event) => {
    const value = valueModel.getValue();
    if (props.value !== value) {
      emit('input', value, event);
    }
  });
  editorIns.onDidBlurEditorText((e) => {
    emit('blur', e);
  });
  exposeObj.editorIns = editorIns;
  emit('inited', editorIns);
}
</script>
<template>
<div class='monaco-wrapper height-100 width-100'>
  <div ref='domRef' class='height-100'/>
</div>
</template>
<style scoped>
:deep(.monaco-editor) {
  height: 100%;
}
</style>
