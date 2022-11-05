<script setup>
import {
  shallowReactive,
  ref,
  onMounted,
} from 'vue';
import ILoadingCover from '../loading-cover';

defineProps({
  loading: Boolean,
});

const dftProps = {
  layout: 'inline',
  labelCol: {
    style: {
      minWidth: '100px',
      maxWidth: '200px',
    },
  },
};

const formRef = ref();
const exposeObj = shallowReactive({});
defineExpose(exposeObj);
onMounted(() => {
  Object.assign(exposeObj, { ...formRef.value });
});

</script>
<template>
  <AForm
    ref="formRef"
    class="form-wrapper"
    v-bind="dftProps"
  >
    <slot />
    <ILoadingCover :loading="loading" />
  </AForm>
</template>
<style scoped>
.form-wrapper {
  position: relative;
}
.ant-form-inline {
  :deep(.ant-form-item) {
    margin-right: 0;
    margin-bottom: 24px;

    &:not(.col-24) {
      padding-left: 10px;
    }

    &.ant-form-item-with-help {
      margin-bottom: 0;
    }

    &.p-0 {
      padding: 0;
    }
  }
}

.loading {
  min-height: 50px;
}
</style>
