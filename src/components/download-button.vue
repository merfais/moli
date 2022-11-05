<script setup>
import {
  reactive,
} from 'vue';
import { errorLog } from '@/uses/log';

const props = defineProps({
  pageSize: Number,
  onDownload: Function,
});
defineEmits([
  'download',
]);

const downModal = reactive({
  visible: false,
  pageSize: 20,
  loading: false,
});


function onClickDownload() {
  Object.assign(downModal, {
    visible: true,
    pageSize: props.pageSize,
    loading: false,
  });
}

async function onDownload() {
  downModal.visible = false;
  downModal.loading = true;
  try {
    await props.onDownload({
      pageSize: downModal.pageSize,
    });
  } catch (e) {
    errorLog({ msg: '下载数据出错：', e });
  }
  downModal.loading = false;
}

</script>
<script>
export default {
  inheritAttrs: false,
};
</script>
<template>
  <AButton
    type='primary'
    :loading="downModal.loading"
    v-bind="$attrs"
    @click="onClickDownload"
  >
    下载
  </AButton>
  <AModal
    title="下载数据"
    v-model:visible="downModal.visible"
    @ok="onDownload"
  >
    <div class="download-input-wrapper">
      <div>下载数据量：</div>
      <AInputNumber
        v-model:value="downModal.pageSize"
        :min="1"
        :max="5000"
      />
    </div>
    <div class="download-tips">最多可下载 5000 条数据</div>
  </AModal>
</template>
<style scoped>
.download-input-wrapper {
  display: flex;
  align-items: center;

  .ant-input-number {
    flex-grow: 1;
  }
}
.download-tips {
  padding: 5px 85px;
  color: #999;
  font-size: 13px;
}

</style>
