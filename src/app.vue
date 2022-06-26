<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
</script>
<template>
  <AConfigProvider :locale="zhCN">
    <RouterView/>
  </AConfigProvider>
</template>
<style src='ant-design-vue/dist/antd.css' />
<style>
@import '@/assets/base.css';
@import '@/assets/antd-reset.css';
</style>
