<script setup>
import { computed } from 'vue';
import {
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
  tips: [Array, String],
});

const tipArr = computed(() => {
  if (typeof props.tips === 'string') {
    return [props.tips];
  }
  return props.tips;
});
</script>
<template>
  <ATooltip>
    <template #title>
      <div v-for="(str, i) in tipArr" :key="str">
        <template v-if="typeof str === 'string'">
        {{i + 1}}. {{str}}
        </template>
        <template v-else>
          <div v-for="subStr in str"
            :key="subStr"
            class="pl-20"
          >
            {{subStr}}
          </div>
        </template>
      </div>
    </template>
    <slot>
      <QuestionCircleOutlined />
    </slot>
  </ATooltip>
</template>
<style scoped>
</style>
