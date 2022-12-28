<script setup>
import {
  SettingOutlined,
  LockOutlined,
  UnlockOutlined,
  EllipsisOutlined,
} from '@ant-design/icons-vue';
import {
  onClickSetting,
} from './use-editor';

defineProps({
  i: String,
});

function onClickLock() {

}
</script>
<template>
  <div class="toolbar align-center p-absolute">
    <AButton
      class="tool-btn"
      size="small"
      @click="onClickSetting(i)"
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
    <AButton
      class="tool-btn"
      size="small"
    >
      <EllipsisOutlined />
    </AButton>
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
}
</style>
