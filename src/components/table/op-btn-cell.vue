<script setup>
import OpBtnCellComp from './op-btn-cell-comp';

const props = defineProps({
  column: Object,
  record: Object,
  index: Number,
  item: {},
  dataKey: String,
  getPopupContainer: Function,
});

function onConfirm(e) {
  if (props.item?.onConfirm) {
    const { column, record, index, item, dataKey: key } = props;
    props.item.onConfirm({ e, column, record, index, item, key });
  }
}

</script>
<template>
  <APopconfirm v-if="item.popConfirmProps"
    v-bind="item.popConfirmProps"
    :getPopupContainer="getPopupContainer"
    placement="left"
    @confirm="onConfirm"
  >
    <OpBtnCellComp
      :column="column"
      :record="record"
      :index="index"
      :item="item"
      :dataKey="dataKey"
    />
  </APopconfirm>
  <OpBtnCellComp v-else
    :column="column"
    :record="record"
    :index="index"
    :item="item"
    :dataKey="dataKey"
  />
</template>
<style scoped>
</style>
