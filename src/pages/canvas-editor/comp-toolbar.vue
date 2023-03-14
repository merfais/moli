<script setup>
import {
  SettingOutlined,
  LockOutlined,
  UnlockOutlined,
  EllipsisOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import {
  removeView,
  onClickSetting,
} from './use-canvas';

const props = defineProps({
  i: String,
  index: Number,
});

function onClickLock() {

}

const menuItems = {
  remove: {
    text: '删除',
    cb: removeView,
    icon: DeleteOutlined,
  },
};

function onClickMenuItem(options = {}) {
  const { key } = options;
  if (menuItems[key]?.cb) {
    menuItems[key].cb(props.i);
  }
}

</script>
<template>
  <div ref="domRef" class="toolbar align-center p-absolute">
    <AButton
      class="tool-btn"
      size="small"
      @click="onClickSetting(i, index)"
    >
      <SettingOutlined />
    </AButton>
    <AButton
      class="tool-btn"
      size="small"
      @click="onClickLock"
    >
      <LockOutlined v-if="true" />
      <UnlockOutlined v-else />
    </AButton>
    <ADropdown
      class="tool-btn"
      size="small"
      :trigger="['click']"
      :getPopupContainer="() => $refs.domRef"
      placement="bottomRight"
    >
      <AButton size="small"><EllipsisOutlined /></AButton>
      <template #overlay>
        <AMenu class="more-menu" @click="onClickMenuItem">
          <AMenuItem v-for="(item, key) in menuItems" :key="key">
            <component :is="item.icon" />
            {{item.text}}
          </AMenuItem>
        </AMenu>
      </template>
    </ADropdown>
  </div>
</template>
<style scoped>
.toolbar {
  top: -15px;
  right: -1px;

  .tool-btn {
    padding: 0 4px;

    & + .tool-btn {
      margin-left: 3px;
    }
  }

  .more-menu {
    width: 70px;
  }
}
</style>
