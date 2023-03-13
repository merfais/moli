<script setup>
import dayjs from 'dayjs';

const props = defineProps({
  value: Array,
  toDayjs: Boolean,
  panelZIndex: Number,
  // ElDatePicker 官方的props
  // format: String,        显示在输入框中的格式
  // valueFormat: String,   绑定值的格式。 不指定则绑定值为 Date 对象
});
const emit = defineEmits([
  'update:value',
]);

function onUpdateValue(valArr) {
  if (props.toDayjs) {
    const value = (valArr || []).map(v => dayjs(v));
    emit('update:value', value);
  } else {
    emit('update:value', valArr);
  }
}
</script>
<script>
export default {
  inheritAttrs: false,
};
</script>
<template>
  <div class="date-time-range-picker"
    :class="{ zindex: !!panelZIndex }"
  >
    <ElDatePicker
      :modelValue="value"
      type="datetimerange"
      startPlaceholder="开始时间"
      endPlaceholder="结束时间"
      :teleported="false"
      v-bind="$attrs"
      @update:modelValue="onUpdateValue"
    />
  </div>
</template>
<style scoped>
.date-time-range-picker {
  :deep(.el-date-editor--datetimerange) {
    justify-content: start;
    width: unset;

    .el-range__icon {
      display: none;
    }

    .el-range-input {
      width: 45%;
      flex-grow: 1;
    }

    .el-range-separator {
      flex: 0 0 auto;
      padding: 0 2px;
    }
  }
  :deep(.el-date-range-picker) {
    width: 600px;

    .el-time-panel {
      width: 133px;
      left: 5px;
    }

    .el-date-range-picker__content {
      padding: 5px 10px;
    }

    .el-picker-panel__icon-btn {
      line-height: 1.15;
    }

    .el-date-table td {
      padding: 0;

      .el-date-table-cell {
        height: 26px;
        padding: 1px 0;
      }
    }
  }

  &.zindex {
    :deep(.el-picker__popper) {
      z-index: v-bind(panelZIndex) !important;
    }
  }
}
</style>
