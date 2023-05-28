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
  'input',
  'update:value',
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
  if (has(unref(props.value), 'left')) {
    return unref(unref(props.value).left);
  }
  return '';
});

const modified = computed(() => {
  if (has(unref(props.value), 'right')) {
    return unref(unref(props.value).right);
  }
  return '';
});

const style = computed(() => ({
  width: props.width,
  height: props.height,
}));

watch(() => unref(props.value), () => {
  const { left, right } = unref(props.value) || {};
  if (originalModel) {
    if (unref(left) !== originalModel.getValue()) {
      originalModel.setValue(unref(left) || '');
    }
  }
  if (modifiedModel) {
    if (unref(right) !== modifiedModel.getValue()) {
      modifiedModel.setValue(unref(right) || '');
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
  exposeObj.editorIns = editorIns;
  exposeObj.originalEditor = originalEditor;
  exposeObj.modifiedEditor = modifiedEditor;

  originalModel.onDidChangeContent((event) => {
    const value = originalModel.getValue();
    const { left } = unref(props.value) || {};
    if (unref(left) !== value) {
      emit('update:value', { ...unref(props.value), left: value });
      emit('input', value, event);
    }
  });

  emit('inited', { editorIns, originalEditor, modifiedEditor });
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
  <div class="monaco-dom-wrapper" :style="style">
    <div ref="domRef" class="editor-ele" />
  </div>
</template>
<style scoped>
.monaco-dom-wrapper {
  border: 1px solid #ddd;
}
.editor-ele {
  height: 100%;
}

:deep(.monaco-editor) {
  height: 100%;
}
</style>

