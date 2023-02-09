<script setup>
import antZhCN from 'ant-design-vue/es/locale/zh_CN';
import elZhCn from 'element-plus/es/locale/lang/zh-cn';
import { ElConfigProvider } from 'element-plus';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/zh-cn';

dayjs.locale(antZhCN.locale);
dayjs.extend(updateLocale);
dayjs.updateLocale(antZhCN.locale, {
  weekStart: 1,
});

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
