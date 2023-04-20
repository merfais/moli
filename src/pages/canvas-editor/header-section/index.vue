<script setup>
import {
  SaveOutlined,
  SelectOutlined,
} from '@ant-design/icons-vue';
import Name from './name';
import {
  save,
} from '../use-canvas';

function onClickCancel() {

}

function onClickSave() {
  save();
}
</script>
<template>
  <section class="header-section align-center p-10-20">
    <Name />
    <div class="divider ml-20" />
    <div class="flex-grow">
      <AButton
        class="ml-20"
        @click="onClickCancel"
      >
        <SelectOutlined />
        取消
      </AButton>
      <AButton
        class="ml-20"
        type="primary"
        @click="onClickSave"
      >
        <SaveOutlined />
        保存
      </AButton>
    </div>
  </section>
</template>
<style scoped>
.header-section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 3px 8px #f1f1f1;
  z-index: 2;

  .divider {
    width: 2px;
    height: 30px;
    background: #f1f1f1;
  }
}
</style>
