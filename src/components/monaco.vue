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
  readonly: Boolean,
});

const emit = defineEmits([
  'inited',
  'input',
  'blur',
  'focus',
]);

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
const placeholderVisible = ref(!props.value);
const exposeObj = reactive({
  resize,
  focus,
});
defineExpose(exposeObj);

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

watch(() => props.readonly, () => {
  if (editorIns) {
    editorIns.updateOptions({ readOnly: props.readonly });
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

function showPlaceholder() {
  placeholderVisible.value = !valueModel.getValue();
}

function init() {
  valueModel = editor.createModel(props.value, props.language);
  editorIns = editor.create(unref(domRef), {
    ...dftOptions,
    ...props.options,
    readOnly: props.readonly,
  });
  editorIns.setModel(valueModel);

  editorIns.onDidChangeModelContent((event) => {
    const value = valueModel.getValue();
    showPlaceholder();
    if (props.value !== value) {
      emit('input', value, event);
    }
  });
  editorIns.onDidBlurEditorWidget((e) => {
    showPlaceholder();
    emit('blur', e);
  });
  editorIns.onDidFocusEditorWidget((e) => {
    showPlaceholder();
    emit('focus', e);
  });
  exposeObj.editorIns = editorIns;
  emit('inited', editorIns);
}
</script>
<template>
<div class='monaco-dom-wrapper height-100 width-100'>
  <div ref='domRef' class='height-100 p-relative'>
    <pre class="p-absolute placeholder"
      :class="{ visible: placeholderVisible }"
    >{{placeholder}}</pre>
  </div>
</div>
</template>
<style scoped>
.monaco-dom-wrapper {
  border: 1px solid #ddd;
}

:deep(.monaco-editor) {
  height: 100%;
}

.placeholder {
  top: 0;
  left: 65px;
  pointer-events: none;
  opacity: 0.7;
  z-index: 1;
  display: none;
  line-height: 1.36;

  &.visible {
    display: block;
  }
}
</style>
