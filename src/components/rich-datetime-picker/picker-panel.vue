<script setup>
import {
  ref,
  watch,
} from 'vue';
import DatetimePanel from './datetime-panel';
import {
  getStaticDayjsValue,
} from './use-picker';

const props = defineProps({
  value: Object,
});

const emit = defineEmits([
  'update:value',
  'ok',
]);

const activeTab = ref();
const staticVal = ref();

watch(() => props.value?.staticVal, () => {
  staticVal.value = getStaticDayjsValue(props.value?.staticVal);
}, { immediate: true });

watch(() => props.value?.type, () => {
  activeTab.value = props.value?.type || 'static';
}, { immediate: true });

function onClickTab(tab) {
  activeTab.value = tab;
}

function onChangeStatic(staticVal) {
  const value = {
    type: 'static',
    staticVal,
  };
  emit('update:value', value);
  emit('ok', value);
}

</script>
<template>
  <div
    class="ant-picker-panel-container"
  >
    <div class="tab-section d-flex">
      <div class="pl-10 pr-10 pb-5 pt-5 c-pointer p-relative"
        :class="{ active: activeTab === 'dynamic'}"
        @click="() => onClickTab('dynamic')"
      >
        动态时间
      </div>
      <div class="pl-10 pr-10 pb-5 pt-5 c-pointer p-relative"
        :class="{ active: activeTab === 'static'}"
        @click="() => onClickTab('static')"
      >
        静态时间
      </div>
    </div>
    <DatetimePanel v-show="activeTab === 'static'"
      v-model:value="staticVal"
      @ok="onChangeStatic"
    />
  </div>
</template>
<style scoped>
.tab-section {
  border-bottom: 1px solid #f1f1f1;
  width: 450px;

  .active {
    transition: all .3s;
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 5px;
      right: 5px;
      border-bottom: 2px solid var(--primary-color);
    }
  }
}
</style>
