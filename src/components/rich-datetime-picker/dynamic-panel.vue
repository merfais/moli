<script setup>
import {
  ref,
} from 'vue';

const type = ref('day');
const day = ref(0);
const hour = ref(0);
const minute = ref(0);
const second = ref(0);
</script>
<template>
  <div>
    <div>
      <ARadio :checked="type === 'day'"
        @update:checked="() => type = 'day'"
        name="type"
      >
        按天
      </ARadio>
      <div class="align-center">
        <AInputNumber
          v-model:value="day"
          :min="0"
          :addonAfter="day ? '天前': '天'"
        />
        <RSelect
          v-model:value="hour"
        />
        <div>时</div>
        <RSelect
          v-model:value="minute"
        />
        <div>分</div>
        <RSelect
          v-model:value="second"
        />
        <div>秒</div>
      </div>
    </div>
    <div>
      <ARadio :checked="type === 'week'"
        @update:checked="() => type = 'week'"
        name="type"
      >
        按星期
      </ARadio>
    </div>
    <div>
      <ARadio :checked="type === 'mounth'"
        @update:checked="() => type = 'mounth'"
        name="type"
      >
        按月
      </ARadio>
    </div>
    <div>
      <ARadio :checked="type === 'year'"
        @update:checked="() => type = 'year'"
        name="type"
      >
        按年
      </ARadio>
    </div>
  </div>
</template>
<style scoped>
</style>
