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
  'change',
  'update:value',
  'blur',
  'focus',
  'changeSelection',
]);

let editorIns;
let valueModel;
let innerOpts = {};
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
  getSelectionValue,
  setSelectionValue,
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
  const value = unref(props.value) || '';
  if (valueModel?.setValue && value !== valueModel.getValue()) {
    valueModel.setValue(value);
  }
}, { deep: true });

watch(() => props.options, () => {
  if (editorIns?.updateOptions) {
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
  if (editorIns?.dispose) {
    editorIns.dispose();
  }
}

function focus() {
  if (editorIns?.focus) {
    editorIns.focus();
  }
}

function resize() {
  if (editorIns?.layout) {
    editorIns.layout();
  }
}

function showPlaceholder() {
  placeholderVisible.value = !valueModel.getValue();
}

function getSelectionValue() {
  if (valueModel?.getValueInRange && editorIns?.getSelection) {
    return valueModel.getValueInRange(editorIns.getSelection());
  }
}

function setSelectionValue(text) {
  if (!editorIns?.getSelection || !editorIns?.executeEdits) {
    return;
  }
  const selection = editorIns.getSelection();
  editorIns.executeEdits('replace', [{
    range: selection,
    text,
  }]);
}

function init() {
  valueModel = editor.createModel(unref(props.value) || '', props.language);
  innerOpts = {
    ...dftOptions,
    ...props.options,
    readOnly: props.readonly,
  };
  editorIns = editor.create(unref(domRef), innerOpts);
  editorIns.setModel(valueModel);

  editorIns.onDidChangeModelContent((event) => {
    const value = valueModel.getValue();
    showPlaceholder();
    if ((unref(props.value) || '') !== value) {
      emit('update:value', value);
      emit('input', value, event);
      emit('change', value, event);
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

  editorIns.onDidChangeCursorSelection((e) => {
    const value = valueModel.getValueInRange(e?.selection);
    emit('changeSelection', { ...e, value });
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
