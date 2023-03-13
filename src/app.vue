<script setup>
import antZhCN from 'ant-design-vue/es/locale/zh_CN';
import elZhCn from 'element-plus/es/locale/lang/zh-cn';

</script>
<template>
  <AConfigProvider :locale="antZhCN">
    <ElConfigProvider :locale="elZhCn">
      <RouterView />
    </ElConfigProvider>
  </AConfigProvider>
</template>
<style src='ant-design-vue/dist/antd.css' />
<style>
@import '@/assets/base.css';
@import '@/assets/antd-reset.css';
</style>
