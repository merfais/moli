<script setup>
import {
  ref,
  unref,
  computed,
  watch,
} from 'vue';
import {
  CalendarOutlined,
  CloseCircleFilled,
} from '@ant-design/icons-vue';
import PickerTrigger from 'ant-design-vue/es/vc-picker/PickerTrigger';
import { useProvidePanel } from 'ant-design-vue/es/vc-picker/PanelContext';
import { onClickOutside } from '@vueuse/core';
import { NOOP } from '@/constants';
import PickerPanel from './picker-panel';
import {
  getStaticDayjsValue,
} from './use-picker';

const props = defineProps({
  value: Object,
  getPopupContainer: Function,
  disabled: Boolean,
  placeholder: String,
});

const emit = defineEmits([
  'change',
  'update:value',
]);


const wrapperDomRef = ref();
const inputDomRef = ref();

const visible = ref(false);
const focused = ref(false);
const hoverValue = ref(false);
const inputReadOnly = ref(false);

const inputValue = ref();
// const selectedValue = ref();

const wrapperClass = computed(() => ({
  'ant-picker': true,
  'ant-picker-disabled': unref(props.disabled),
  'ant-picker-focused': unref(focused),
}));

const inputWrapperClass = computed(() => ({
  'ant-picker-input': true,
  'ant-picker-input-placeholder': unref(hoverValue),
}));

useProvidePanel({
  open: visible,
});

onClickOutside(wrapperDomRef, () => {
  focused.value = false;
  visible.value = false;
});

watch(() => props.value, () => {
  const { type, staticVal } = props.value || {};
  if (type === 'static') {
    const text = getStaticDayjsValue(staticVal);
    inputValue.value = text ? text.format('YYYY-MM-DD HH:mm:ss') : undefined;
  }
}, { immediate: true, deep: true });

function onMouseup() {
  if (unref(props.disabled)) {
    return;
  }
  if (unref(inputDomRef)) {
    unref(inputDomRef).focus();
    focused.value = true;
    visible.value = true;
  }
}

function onBlur() {

}

function onClearIconMouseup() {
  updateValue({ type: 'static' });
  focused.value = true;
}

function updateValue(value) {
  visible.value = false;
  emit('change', value);
  emit('update:value', value);
}


function onOk(value) {
  updateValue(value);
}

</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <PickerTrigger
    :visible="visible"
    prefixCls="ant-picker"
    :getPopupContainer="() => wrapperDomRef"
    transitionName="ant-slide-up"
  >
    <template #popupElement>
      <PickerPanel
        :visible="visible"
        :value="value"
        @ok="onOk"
      />
    </template>
    <div
      ref="wrapperDomRef"
      v-bind="$attrs"
      :class="wrapperClass"
    >
      <div
        :class="inputWrapperClass"
        @mouseup="onMouseup"
      >
        <input ref="inputDomRef"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="inputReadOnly"
          v-model="inputValue"
          autocomplete="off"
          @blur="onBlur"
        />
        <span class="ant-picker-suffix">
          <CalendarOutlined />
        </span>
        <span v-if="inputValue"
          class="ant-picker-clear"
          role="button"
          @mousedown.stop.prevent="NOOP"
          @mouseup.prevent.stop="onClearIconMouseup"
        >
          <CloseCircleFilled />
        </span>
      </div>
    </div>
  </PickerTrigger>
</template>
<style scoped>
</style>
