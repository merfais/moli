<script setup>
import {
  ref,
  unref,
  computed,
} from 'vue';
import PickerTrigger from 'ant-design-vue/es/vc-picker/PickerTrigger';
import PickerPanel from './picker-panel';

const props = defineProps({
  getPopupContainer: Function,
  disabled: Boolean,
});

const prefixCls = 'ant-picker';

const domRef = ref();
const inputDomRef = ref();
const visible = ref(false);
const focused = ref(false);
const hoverValue = ref(false);

const wrapperClassName = computed(() => ({
  prefixCls: true,
  [`${prefixCls}-disabled`]: unref(props.disabled),
  [`${prefixCls}-focused`]: unref(focused),
}));

const inputWrapperClassName = computed(() => ({
  [`${prefixCls}-input`]: true,
  [`${prefixCls}-input-placeholder`]: unref(hoverValue),
}));

function onMouseup() {

}

</script>
<script>export default { inheritAttrs: false }; </script>
<template>
  <PickerTrigger
    :visible="visible"
    :prefixCls="prefixCls"
    :getPopupContainer="getPopupContainer"
  >
    <template #popupElement>
      <PickerPanel />
    </template>
    <div
      ref="domRef"
      v-bind="$attrs"
      :class="wrapperClassName"
      @onMouseup="onMouseup"
    >
      <div
        ref="inputDomRef"
        :class="inputWrapperClassName"
      >
        <input  />
        <!--span v-if="":class="`${prefixCls}-suffix`">
          <SuffixIcon />
        </span-->;
        <!--span
          onMousedown={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseup={e => {
            e.preventDefault();
            e.stopPropagation();
            triggerChange(null);
            triggerOpen(false);
          }}
          class={`${prefixCls}-clear`}
          role="button"
        >
          <span class={`${prefixCls}-clear-btn`} />
        </span-->
      </div>
    </div>
  </PickerTrigger>
</template>
<style scoped>
</style>
