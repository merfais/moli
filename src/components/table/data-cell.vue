<script setup>
import {
  computed,
} from 'vue';
import DataCellComp from './data-cell-comp';
import ImgLink from './img-link';

const props = defineProps({
  column: Object,
  record: Object,
  index: Number,
  item: {},
  getPopupContainer: Function,
  displayRaw: Boolean,
});

const cellText = computed(() => {
  let text = props.item;
  if (typeof props.item === 'object'
    && (props.column.component || props.item?.component)
  ) {
    text = props.item.text;
  }

  if (props.displayRaw && typeof text === 'object') {
    return JSON.stringify(text);
  }
  return text;
});
const cellHtml = computed(() => {
  if (typeof props.item === 'string') {
    return props.item;
  }
  return props.item?.html || props.item?.text;
});

const isImg = computed(() => {
  const { valueType } = props.column || {};
  return valueType === 'picture' || valueType === 'img';
});
const isUrl = computed(() => /^https?:\/\//.test(cellText.value));

</script>
<template>
  <template v-if="item?.component || column.component">
    <APopconfirm v-if="item?.popConfirmProps"
      v-bind="item.popConfirmProps"
      :getPopupContainer="getPopupContainer"
      @confirm="item.onConfirm({ column, record, item, index })"
    >
      <DataCellComp
        :column="column"
        :record="record"
        :index="index"
        :item="item"
        :cellText="cellText"
        :cellHtml="cellHtml"
      />
    </APopconfirm>
    <DataCellComp v-else
      :column="column"
      :record="record"
      :index="index"
      :item="item"
      :cellText="cellText"
      :cellHtml="cellHtml"
    />
  </template>
  <template v-else-if="item?.html || column.isHtml">
    <span v-html="cellHtml" />
  </template>
  <ImgLink v-else-if="isImg"
    :href="cellText"
  />
  <a v-else-if="isUrl"
    :href="cellText"
    target="_blank"
    >
    {{cellText}}
  </a>
  <template v-else>
    {{cellText}}
  </template>
</template>
<style scoped>
</style>
