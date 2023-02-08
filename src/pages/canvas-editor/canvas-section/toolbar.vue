<script setup>
import {
  SettingOutlined,
  LockOutlined,
  UnlockOutlined,
  EllipsisOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import {
  onClickSetting,
} from './use-section';

defineProps({
  i: String,
  index: Number,
});

function onClickLock() {

}

function onClickMenuItem(options = {}) {
  const cbMap = {
    remove: onClickRemove,
  };
  const { key } = options;
  if (cbMap[key]) {
    cbMap[key]();
  }
}

function onClickRemove() {

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
      @click="onClickMenuItem"
    >
      <AButton size="small"><EllipsisOutlined /></AButton>
      <template #overlay>
        <AMenu class="more-menu">
          <AMenuItem :key="remove">
            <DeleteOutlined />
            删除
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
