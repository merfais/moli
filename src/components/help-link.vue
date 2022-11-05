<script setup>
import {
  BulbOutlined,
} from '@ant-design/icons-vue';

defineProps({
  href: String,
  top: {
    type: [String, Number],
    default: 0,
  },
  right: {
    type: [String, Number],
    default: '5px',
  },
});
</script>
<template>
  <AButton class="help-link-btn" type="link">
    <a
      :href="href"
      target="_blank"
    >
      <BulbOutlined />
      帮助文档
    </a>
  </AButton>
</template>
<style scoped>
.help-link-btn {
  position: absolute;
  right: v-bind(right);
  top: v-bind(top);
}
</style>

