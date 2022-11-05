<script setup>
import {
  get,
} from 'lodash-es';
import {
  computed,
} from 'vue';

const props = defineProps({
  fold: Boolean,
  textMap: {
    type: Object,
    default: () => ({
      true: '更多',
      false: '收起',
    }),
  },
  colorMap: {
    type: Object,
    default: () => ({
      true: '#5bc0de',
      false: '#337ab7',
    }),
  },
});

const emit = defineEmits([
  'update:fold',
  'click',
]);

const text = computed(() => get(props.textMap, props.fold || false));
const color = computed(() => get(props.colorMap, props.fold || false));

function onClickCollapse(e) {
  const value = !props.fold;
  emit('update:fold', value);
  emit('click', value, e);
}

</script>
<template>
  <ATag
    class="c-pointer"
    :color="color"
    @click="onClickCollapse"
  >
    <slot>{{text}}</slot>
  </ATag>
</template>
<style scoped>
</style>
