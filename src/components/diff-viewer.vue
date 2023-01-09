<script setup>
import {
  ref,
  onMounted,
  watch,
  reactive,
  computed,
  unref,
  onBeforeUnmount,
} from 'vue';
import {
  has,
} from 'lodash-es';
import { editor } from 'monaco-editor';

const props = defineProps({
  language: {
    type: String,
    default: 'json',
  },
  value: Object,
  options: Object,
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
});

const emit = defineEmits([
  'inited',
]);

let editorIns;
let originalModel;
let modifiedModel;
const dftOptions = {
  readOnly: true,
  contextmenu: false,
  showFoldingControls: 'always',
};
let ro;
const domRef = ref();
const exposeObj = reactive({
  resize,
  focus,
});

const original = computed(() => {
  if (has(props.value, 'left')) {
    return props.value.left;
  }
  return '';
});

const modified = computed(() => {
  if (has(props.value, 'right')) {
    return props.value.right;
  }
  return '';
});

const style = computed(() => ({
  width: props.width,
  height: props.height,
}));

watch(() => props.value, () => {
  const { left, right } = props.value || {};
  if (originalModel) {
    if (left !== originalModel.getValue()) {
      originalModel.setValue(left);
    }
  }
  if (modifiedModel) {
    if (right !== modifiedModel.getValue()) {
      modifiedModel.setValue(right);
    }
  }
}, { deep: true });
watch(() => props.options, () => {
  if (editorIns) {
    editorIns.updateOptions(props.options);
  }
}, { deep: true });

watch(() => props.language, () => {
  if (originalModel) {
    editor.setModelLanguage(originalModel, props.language);
  }
  if (modifiedModel) {
    editor.setModelLanguage(modifiedModel, props.language);
  }
});

function init() {
  originalModel = editor.createModel(unref(original), props.language);
  modifiedModel = editor.createModel(unref(modified), props.language);
  editorIns = editor.createDiffEditor(unref(domRef), {
    ...dftOptions,
    ...props.options,
  });
  editorIns.setModel({
    original: originalModel,
    modified: modifiedModel,
  });
  const originalEditor = editorIns.getOriginalEditor();
  const modifiedEditor = editorIns.getModifiedEditor();
  emit('inited', { editorIns, originalEditor, modifiedEditor });
  exposeObj.editorIns = editorIns;
  exposeObj.originalEditor = originalEditor;
  exposeObj.modifiedEditor = modifiedEditor;
}

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

onMounted(() => {
  init();
  window.addEventListener('resize', resize);
  ro = new ResizeObserver(() => {
    resize();
  });
  ro.observe(unref(domRef));
});

onBeforeUnmount(() => {
  dispose();
  window.removeEventListener('resize', resize);
  ro.disconnect();
});

defineExpose(exposeObj);
</script>
<template>
  <div :style="style">
    <div ref="domRef" class="editor-ele" />
  </div>
</template>
<style scoped>
.editor-ele {
  height: 100%;
}

:deep(.monaco-editor) {
  height: 100%;
}
</style>

