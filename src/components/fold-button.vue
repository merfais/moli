<script setup>
import {
  computed,
} from 'vue';
import {
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons-vue';
import IButton from './button';

const props = defineProps({
  fold: Boolean,
  direction: {
    type: String,
    default: 'up',
  },
  textPosition: {
    type: String,
    default: 'left',
  },
});

const emit = defineEmits([
  'update:fold',
  'click',
]);

const compMap = {
  up: {
    true: DownOutlined,
    false: UpOutlined,
  },
  down: {
    true: UpOutlined,
    false: DownOutlined,
  },
};

const comp = computed(() => {
  const tmp = compMap[props.direction] || compMap.up;
  return tmp[props.fold];
});

function onClickCollapse(e) {
  const value = !props.fold;
  emit('update:fold', value);
  emit('click', value, e);
}

</script>
<template>
  <IButton
    @click="onClickCollapse"
  >
    <slot v-if="textPosition === 'left'" />
    <component :is="comp" />
    <slot v-if="textPosition === 'right'" />
  </IButton>
</template>
<style scoped>
</style>
