<script setup>
import { get } from 'lodash-es';
import { message } from 'ant-design-vue';
import {
  LoadingOutlined,
} from '@ant-design/icons-vue';
import useCopyText from '@/uses/copy';

const props = defineProps({
  label: String,
  value: [String, Boolean, Number],
  title: String,
  is: {},
  compProps: Object,
  loading: Boolean,
});

function onClickCopy(options) {
  const text = getValueText(options);
  useCopyText(text);
  message.success('复制成功');
}

function getValueText() {
  if (props.is === 'ImgLink' || props.is === 'a') {
    return get(props, 'compProps.href');
  }
  return props.value;
}

</script>
<template>
  <div class="d-flex label-value-info">
    <div
      class="label f-bold flex-0-0 break-all justify-end"
      :title="title"
    >
      {{label}}：
    </div>
    <div v-if="loading">
      <LoadingOutlined />
    </div>
    <div v-else class="value flex-grow break-all p-relative">
      <component v-if="is"
        :is="is"
        v-bind="compProps"
      >
        {{value}}
      </component>
      <template v-else>{{value}}</template>
      <ATag
        class="copy-tag c-pointer d-none p-absolute m-0"
        color="green"
        @click.stop="onClickCopy({ column, record })"
      >
        复制
      </ATag>
    </div>
  </div>
</template>
<style scoped>
.label-value-info {
  padding: 2px;
  &:hover {
    background: var(--primary-bg-color);
  }
}
.label {
  width: 150px;
}
.value {
  &:hover > .copy-tag {
    display: unset;
  }

  .copy-tag {
    right: 0;
    top: 0;
  }
}
</style>
