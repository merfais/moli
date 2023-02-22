<script setup>
import {
  computed,
} from 'vue';

const props = defineProps({
  placeholder: String,
  multiple: Boolean,
  label: String,
  exportDS1: String,
  enableSelectAll: Boolean,
  specialValue: String,
  labelField: {
    type: String,
    default: 'label',
  },
  valueField: {
    type: String,
    default: 'value',
  },
  options: Array,
  depDS: String,
});

const emit = defineEmits([
  'update:value',
  'update:var',
]);

const innerPlaceholder = computed(() => {
  if (props.placeholder) {
    return props.placeholder;
  }
  const target = props.label || '数据';
  return `请选择${target}`;
});

const mode = computed(() => (props.multiple ? 'multiple' : ''));
const innerOptions = computed(() => {
  return props.options;
});
const allItemClass = computed(() => {
  return {};
});

function onUpdateValue(value) {
  emit('update:value', value);
  emit('update:var', {
    varId: props.exportDS1,
    value,
  });
}

function onClickAllItem() {

}

const VNodes = (_, { attrs }) => attrs.vnodes;

</script>
<template>
  <RSelect
    class="width-100"
    :placeholder="innerPlaceholder"
    :mode="mode"
    :options="innerOptions"
    @update:value="onUpdateValue"
  >
    <template #dropdownRender="{ menuNode }">
      <template v-if="enableSelectAll">
        <div
          class="ant-select-item ant-select-item-option"
          :class="allItemClass"
          @click="onClickAllItem"
        >
          全选
        </div>
        <a-divider style="margin: 4px 0" />
      </template>
      <VNodes :vnodes="menuNode" />
    </template>
  </RSelect>
</template>
<style scoped>
</style>
