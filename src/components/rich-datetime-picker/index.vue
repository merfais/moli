<script setup>
import {
  ref,
  unref,
  computed,
} from 'vue';
import {
  CalendarOutlined,
  CloseCircleFilled,
} from '@ant-design/icons-vue';
import PickerTrigger from 'ant-design-vue/es/vc-picker/PickerTrigger';
import PickerPanel from './picker-panel';

const props = defineProps({
  getPopupContainer: Function,
  disabled: Boolean,
  placeholder: String,
});

const emit = defineEmits([
  'change',
  'update:value',
]);

const inputDomRef = ref();
const visible = ref(false);
const focused = ref(false);
const hoverValue = ref(false);
const inputReadOnly = ref(false);

const inputValue = ref();
const selectedValue = ref();

const wrapperClass = computed(() => ({
  'ant-picker': true,
  'ant-picker-disabled': unref(props.disabled),
  'ant-picker-focused': unref(focused),
}));

const inputWrapperClass = computed(() => ({
  'ant-picker-input': true,
  'ant-picker-input-placeholder': unref(hoverValue),
}));

function onMouseup() {
  if (unref(inputDomRef)) {
    unref(inputDomRef).focus();
    triggerOpen(true);
  }
}

function onClearIconMouseup() {
  triggerChange(null);
  triggerOpen(false);
}

function onClearIconMousedown() {
}
function triggerChange(newValue) {
  const { onChange, generateConfig, locale } = props;
  selectedValue.value = newValue;
  // setInnerValue(newValue);

  emit('change', newValue);
  emit('update:value', newValue);
  // if (onChange && !isEqual(generateConfig, mergedValue.value, newValue)) {
  //   onChange(
  //     newValue,
  //     newValue
  //       ? formatValue(newValue, { generateConfig, locale, format: formatList.value[0] })
  //       : '',
  //   );
  // }
}

function triggerOpen(newOpen) {
  if (props.disabled && newOpen) {
    return;
  }
  visible.value = newOpen;
  // triggerInnerOpen(newOpen);
}

</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <PickerTrigger
    :visible="visible"
    prefixCls="ant-picker"
    :getPopupContainer="getPopupContainer"
    transitionName="ant-slide-up"
  >
    <template #popupElement>
      <PickerPanel />
    </template>
    <div
      v-bind="$attrs"
      :class="wrapperClass"
      @mouseup="onMouseup"
    >
      <div
        :class="inputWrapperClass"
      >
        <input ref="inputDomRef"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="inputReadOnly"
          :value="inputValue"
          autocomplete="off"
        />
        <span class="ant-picker-suffix">
          <CalendarOutlined />
        </span>
        <span v-if="inputValue"
          class="ant-picker-clear"
          role="button"
          @mousedown.stop.prevent="onClearIconMousedown"
          @mouseup.prevent.stop="onClearIconMouseup"
        >
          <CloseCircleFilled />
          <!--span class="ant-picker-clear-btn" /-->
        </span>
      </div>
    </div>
  </PickerTrigger>
</template>
<style scoped>
</style>
