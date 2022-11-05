<script setup>
import {
  ref,
  computed,
  unref,
} from 'vue';
import {
  DownOutlined,
} from '@ant-design/icons-vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  value: [String, Number, Boolean],
  title: [String, Number, Boolean],
  minWidth: {
    type: String,
    default: null,
  },
  width: {
    type: String,
    default: null,
  },
  zIndex: {
    type: [String, Number],
    default: 1,
  },
  placeholder: String,
});

const panelVisible = ref(false);
const focused = ref(false);
const selectorDom = ref();

const selectorClass = computed(() => ({
  'drop-down-wrapper': true,
  focused: focused.value,
  opened: panelVisible.value,
}));

const showPlaceholder = computed(() => {
  return props.value === null
    || props.value === undefined
    || props.value === '';
});

onClickOutside(selectorDom, () => {
  focused.value = false;
  panelVisible.value = false;
});

function onClickSelector() {
  focused.value = true;
  panelVisible.value = true;
}

function onClickValueWrapper() {
  focused.value = true;
  panelVisible.value = !panelVisible.value;
}

defineExpose({
  close: () => panelVisible.value = false,
  open: () => panelVisible.value = true,
  getDom: () => unref(selectorDom),
});

</script>
<template>
  <ATooltip
    :getPopupContainer="() => $refs.selectorDom"
    trigger="manual"
    placement="bottomLeft"
    v-model:visible="panelVisible"
    :zIndex="zIndex"
  >
    <div
      ref="selectorDom"
      :class="selectorClass"
      @click="onClickSelector"
    >
      <div class="value-wrapper"
        @click.stop="onClickValueWrapper"
      >
        <span
          class="value-label"
          :title="title || value"
        >
          <slot name="value">
            {{value}}
          </slot>
        </span>
        <span v-show="showPlaceholder"
          class="value-placeholder"
        >
          {{placeholder}}
        </span>
      </div>
      <span class="icon-wrapper">
        <slot name="icon">
          <DownOutlined />
        </slot>
      </span>
    </div>
    <template #title>
      <slot />
    </template>
  </ATooltip>
</template>
<style scoped>
.drop-down-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
  min-width: v-bind(minWidth);
  width: v-bind(width);

  &.focused {
    .value-wrapper {
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
      outline: 0;
    }
  }

  &.opened {
    .value-wrapper {
      color: #bfbfbf;
    }
  }

  .value-wrapper {
    position: relative;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    height: 32px;
    padding: 0 11px;
    display: flex;

    .value-label {
      padding: 0;
      line-height: 30px;
      transition: all 0.1s;
      flex: 1;
      overflow: hidden;
      font-weight: normal;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-right: 18px;
    }

    .value-placeholder {
      position: absolute;
      top: 50%;
      right: 11px;
      left: 11px;
      transform: translateY(-50%);
      transition: all 0.3s;
      flex: 1;
      overflow: hidden;
      color: #bfbfbf;
      white-space: nowrap;
      text-overflow: ellipsis;
      pointer-events: none;
    }
  }

  .icon-wrapper {
    display: inline-block;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizelegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    top: 50%;
    right: 11px;
    width: 12px;
    height: 12px;
    margin-top: -6px;
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
    line-height: 1;
    text-align: center;
    pointer-events: none;
  }
}
:deep(.ant-tooltip) {
  min-width: 100%;
  padding: 0;

  .ant-tooltip-arrow {
    display: none;
  }
  .ant-tooltip-inner {
    color: inherit;
    background: #fff;
    min-height: 150px;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    width: fit-content;
  }
}

</style>
