<script setup>
import {
  SwapOutlined,
} from '@ant-design/icons-vue';
import {
  SortDescIcon,
  SortAscIcon,
} from '../icons';

defineProps({
  order: String,
});

</script>
<template>
  <SortDescIcon v-if="order === 'desc'" class="primary" />
  <SortAscIcon v-else-if="order === 'asc'" class="primary" />
  <SwapOutlined v-else class="rotate-90" />
</template>
<style scoped>
</style>
