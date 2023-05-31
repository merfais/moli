<script setup>
import {
  inject,
  h,
  computed,
} from 'vue';
import { Button } from 'ant-design-vue';
import { PickerPanel } from 'ant-design-vue/es/vc-picker';
import generateConfig from 'ant-design-vue/es/vc-picker/generate/dayjs';
import { useProvidePanel } from 'ant-design-vue/es/vc-picker/PanelContext';

const props = defineProps({
  visible: Boolean,
});

const localeData = inject('localeData');

const components = {
  button: h(Button, { type: 'primary', size: 'small' }),
};

useProvidePanel({
  open: computed(() => props.visible),
});

</script>
<template>
  <PickerPanel
    :generateConfig="generateConfig"
    :locale="localeData?.antLocale?.DatePicker?.lang"
    prefixCls="ant-picker"
    showToday
    showTime
    picker="date"
    :prevIcon="h('span',{ class: 'ant-picker-prev-icon' })"
    :nextIcon="h('span',{ class: 'ant-picker-next-icon' })"
    :superPrevIcon="h('span',{ class: 'ant-picker-super-prev-icon' })"
    :superNextIcon="h('span',{ class: 'ant-picker-super-next-icon' })"
    :components="components"
  />
</template>
<style scoped>
</style>
