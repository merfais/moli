<script setup>
import {
  shallowRef,
} from 'vue';
import {
  initConfForm,
} from '../use-common';
import {
  genFormItems,
} from './use-editor';

const formItems = shallowRef({});

initConfForm({
  formItems,
  genFormItems,
});

</script>
<template>
  <FormItems
    :items="formItems"
  >
    <template #divider="{ text }">
      <div class="col-24 divider pl-20 p-relative">
        {{text}}
      </div>
    </template>
  </formItems>
</template>
<style scoped>
.divider {
  font-size: 16px;
  font-weight: 550;
  margin: 0 20px 10px 10px;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-left: 10px solid #aaa;
  }
}
</style>
