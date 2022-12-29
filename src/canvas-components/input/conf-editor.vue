<script setup>
import {
  shallowRef,
} from 'vue';
import {
  initConfForm,
} from './use-editor';

const formItems = shallowRef({});

initConfForm({ formItems });

</script>
<template>
  <FormItems
    :items="formItems"
  />
</template>
<style scoped>
</style>
