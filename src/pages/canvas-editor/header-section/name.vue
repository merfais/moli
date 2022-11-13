<script setup>
import {
  ref,
  unref,
} from 'vue';
import { message } from 'ant-design-vue';
import { vElementHover } from '@vueuse/components';
import { useFocus } from '@vueuse/core';
import { useCanvasEditorStore } from '../use-canvas-editor';

const store = useCanvasEditorStore();

const name = ref('');
const inputRef = ref();
const nameEdited = ref(false);

function onHover() {
  nameEdited.value = true;
  name.value = store.baseInfo.name || '我的画布';
  useFocus(inputRef, { initialValue: true });
}

function onSaveName() {
  nameEdited.value = false;
  const nameStr = (unref(name) || '').trim();
  if (!nameStr) {
    message.warn('画布名字不能清空');
    return;
  }
  store.baseInfo.name = nameStr;
}

</script>
<template>
  <div class="name-wrapper">
    <AInput v-if="nameEdited"
      ref="inputRef"
      v-model:value="name"
      class="name-input"
      @blur="onSaveName"
    />
    <div v-else
      class="name-text ellipsis"
      v-element-hover="onHover"
    >
      {{store.baseInfo.name}}
    </div>
  </div>
</template>
<style scoped>
.name-wrapper {
  width: 220px;

  .name-text {
    font-size: 16px;
    font-weight: bold;
  }
}

</style>
