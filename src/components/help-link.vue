<script setup>
import {
  BulbOutlined,
} from '@ant-design/icons-vue';

defineProps({
  href: String,
});
</script>
<template>
  <AButton type="link">
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
</style>

