<script setup>
import {
  computed,
  ref,
} from 'vue';
import {
  SettingOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';

defineProps({
  disableDel: Boolean,
  enableConfim: Boolean,
  confirmText: {
    type: String,
    default: '确认删除吗？',
  },
});
const emit = defineEmits([
  'hover',
  'clickSetting',
  'clickCopy',
  'clickDelete',
]);

const hover = ref(false);
const className = computed(() => (hover.value ? 'active' : ''));

function onMouseEnter() {
  hover.value = true;
  emit('hover');
}

function onMouseLeave() {
  hover.value = false;
}

function onClickConfirm() {
  emit('clickDelete');
}

</script>
<template>
  <div class='tool-box'
    :class="className"
    ref="boxDom"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div v-show="hover" class="tool-hover-right-blank" />
    <div v-show="hover" class="tool-hover-top-blank" />
    <div v-show="hover" class="tool-btns">
      <AButton
        class='tool-btn'
        type="link"
        title="设置"
        @click="$emit('clickSetting')"
      >
        <SettingOutlined :size="15" />
      </AButton>
      <AButton
        class='tool-btn'
        type="link"
        title="拷贝"
        @click="$emit('clickCopy')"
      >
        <CopyOutlined :size="15" />
      </AButton>
      <template v-if="!disableDel">
        <APopconfirm v-if="enableConfim"
          :title="confirmText"
          :getPopupContainer="() => $refs.boxDom"
          @confirm="onClickConfirm"
        >
          <AButton
            class='tool-btn'
            type="link"
            title="删除"
          >
            <DeleteOutlined  :size="15" />
          </AButton>
        </APopconfirm>
        <AButton v-else
          class='tool-btn'
          type="link"
          title="删除"
          @click="$emit('clickDelete')"
        >
          <DeleteOutlined  :size="15" />
        </AButton>
      </template>
    </div>
    <slot />
  </div>
</template>
<style scoped>
.tool-box {
  position: relative;

  &.active {
    box-shadow: 0 0 2px 1px #096dd9;
    border-radius: 1px;
  }

  .tool-hover-top-blank {
    position: absolute;
    top: -4px;
    left: 0;
    right: 0;
    height: 5px;
  }

  .tool-hover-right-blank {
    position: absolute;
    top: -20px;
    right: 40px;
    height: 20px;
    width: 40px;
  }

  .tool-btns {
    position: absolute;
    right: 0;
    top: -20px;
    background: #1890ffc0;
    display: flex;
    border-radius: 2px 2px 0 0;
  }

  .tool-btn {
    padding: 0 2px;
    margin: 0;
    font-size: 14px;
    height: 20px;
    display: flex;
    align-items: center;
    color: #fff;

    &:hover {
      background: var(--info-color);
    }
  }

  :deep(.ant-popover-content) {
    min-width: 160px;
  }
}
</style>
