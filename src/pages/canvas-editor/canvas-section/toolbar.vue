<script setup>
import {
  SettingOutlined,
  LockOutlined,
  EllipsisOutlined,
} from '@ant-design/icons-vue';
</script>
<template>
  <div class="toolbar align-center p-absolute">
    <AButton
      class="tool-btn"
      size="small"
    >
      <SettingOutlined />
    </AButton>
    <AButton
      class="tool-btn"
      size="small"
    >
      <LockOutlined />
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
