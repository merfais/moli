<script setup>
import { computed } from 'vue';
import {
  CheckSquareOutlined,
  BorderOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
  value: Boolean,
  title: {
    type: [Array, String],
    default: () => (['', '']),
  },
  label: [String, Array],
});
const emit = defineEmits([
  'update:value',
]);

const btnTitle = computed(() => {
  if (typeof props.title === 'string') {
    return props.title;
  }
  if (Array.isArray(props.title) && props.title.length) {
    return props.value ? props.title[0] : props.title[1];
  }
  return '';
});

const type = computed(() => (props.value ? 'primary' : 'default'));

const onClick = () => {
  const value = !props.value;
  emit('update:value', value);
};
</script>
<template>
  <AButton
    class='button-checkbox'
    :type="type"
    :title="btnTitle"
    @click="onClick"
  >
    <slot>
      <CheckSquareOutlined v-if="props.value"/>
      <BorderOutlined v-else/>
      {{label}}
    </slot>
  </AButton>
</template>
<style scoped>
.button-checkbox {
  border-right-color: #d9d9d9;
  border-left-color: #d9d9d9;
}
</style>
