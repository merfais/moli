<script setup>
import {
  inject,
  h,
} from 'vue';
import { Button } from 'ant-design-vue';
import { PickerPanel } from 'ant-design-vue/es/vc-picker';
import generateConfig from 'ant-design-vue/es/vc-picker/generate/dayjs';

defineEmits([
  'update:value',
]);

const localeData = inject('localeData');

const components = {
  button: h(Button, { type: 'primary', size: 'small' }),
};

</script>
<template>
  <PickerPanel
    :generateConfig="generateConfig"
    :locale="localeData?.antLocale?.DatePicker?.lang"
    prefixCls="ant-picker"
    showToday
    :showTime="{ format: undefined, picker: 'date' }"
    picker="date"
    :prevIcon="h('span',{ class: 'ant-picker-prev-icon' })"
    :nextIcon="h('span',{ class: 'ant-picker-next-icon' })"
    :superPrevIcon="h('span',{ class: 'ant-picker-super-prev-icon' })"
    :superNextIcon="h('span',{ class: 'ant-picker-super-next-icon' })"
    :components="components"
    @change="v => $emit('update:value', v)"
  />
</template>
<style scoped>
</style>
