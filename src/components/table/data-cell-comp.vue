<script setup>
import {
  merge,
} from 'lodash-es';

const props = defineProps({
  column: Object,
  record: Object,
  index: Number,
  item: {},
  cellText: [String, Number],
  cellHtml: [String, Number],
});

function onCompClick(e) {
  if (props.item?.onClick) {
    return props.item.onClick({ e, ...props });
  }
  if (props.column?.onClick) {
    return props.column.onClick({ e, ...props });
  }
}

function onUpdateValue(value) {
  if (props.column?.['onUpdate:value']) {
    props.column['onUpdate:value']({ value, ...props });
  }
}

</script>
<template>
  <component v-if="item?.html || column.isHtml"
    :is="item.component || column.component"
    v-bind="merge({}, column.compProps, item?.compProps)"
    @click="onCompClick"
    @update:value="onUpdateValue"
    v-html="cellHtml"
  />
  <component v-else
    :is="item?.component || column.component"
    v-bind="merge({}, column.compProps, item?.compProps)"
    @click="onCompClick"
    @update:value="onUpdateValue"
  >
    {{cellText}}
  </component>
</template>
<style scoped>
</style>
