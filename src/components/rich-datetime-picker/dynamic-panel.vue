<script setup>
import {
  map,
} from 'lodash-es';
import {
  ref,
  // unref,
} from 'vue';

const domRef = ref();
const dateType = ref('0_d');
const timeType = ref('now');
const num = ref(1);
const unit = ref('d');
const order = ref('subtract');

const month = ref(1);
const week = ref(1);
const day = ref(0);
const time = ref();
const hour = ref(0);
const minute = ref(0);
const second = ref(0);

const options = [{
  label: '今天',
  value: '0_d',
}, {
  label: '本周',
  value: '0_w',
}, {
  label: '本月',
  value: '0_M',
}, {
  label: '本年',
  value: '0_y',
}];
const unitNameMap = {
  d: '天',
  w: '周',
  M: '月',
  y: '年',
};
const orderNameMap = {
  subtract: '前',
  add: '后',
};
const weekNameArr = [
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
  '周日',
];
const uintOpts = map(unitNameMap, (label, value) => ({ label, value }));
const orderOpts = map(orderNameMap, (label, value) => ({ label, value }));
const monthOpts = map(Array(12), (_, i) => ({ label: `${i + 1}月`, value: i + 1 }));
const dayOpts = map(Array(31), (_, i) => ({ label: `${i + 1}日`, value: i + 1 }));
const weekOpts = map(Array(7), (_, i) => ({ label: weekNameArr[i], value: i + 1 }));

// function genItems() {
//   const weekSelector = {
//     is: 'ASelect',
//     compProps: {
//       value: unref(week),
//       options: weekOpts,
//       disabled: unref(timeType) !== 'week' || unref(unit) !== 'w',
//       getPopupContainer,
//       'onUpdate:value': onUpdateValue(week),
//     },
//   }
// }

// function getPopupContainer() {
//   return unref(domRef)
// }
//
// function onUpdateValue(target) {
//   return (value) => target.value = value
// }

function onChangeDateType(e) {
  const { value } = e.target;
  dateType.value = value;

  if (value === 'adv') {
    num.value = 1;
    order.value = 'subtract';
  } else {
    const [n, u] = value.split('_');
    num.value = n;
    unit.value = u;
    order.value = undefined;
  }
}

function onChangeTimeType(e) {
  const { value } = e.target;
  timeType.value = value;
}

function onChangeNum() {
}

function onChangeUnit() {

}
function onChangeOrder() {
}

function onChangeTime(timeStr) {
  const [h, m, s] = timeStr.split(':');
  hour.value = Number(h);
  minute.value = Number(m);
  second.value = Number(s);
}

</script>
<template>
  <div ref="domRef" class="p-10 d-flex">
    <div class="flex-0-0">
      <div class="cat-date pr-10">日期</div>
      <div class="cat-time pr-10">时间</div>
    </div>
    <div>
      <ARadioGroup
        :value="dateType"
        :options="options"
        @change="onChangeDateType"
      />
      <div class="align-center mt-5 mb-15">
        <ARadio :checked="dateType === 'adv'"
          name="dateType"
          value="adv"
          @change="onChangeDateType"
        >
          其他
        </ARadio>
        <AInputNumber
          class="w-80"
          :value="num"
          :min="0"
          :disabled="dateType !== 'adv'"
          :getPopupContainer="() => $refs.domRef"
          @change="onChangeNum"
        />
        <RSelect
          class="w-80"
          :allowClear="false"
          :value="unit"
          :options="uintOpts"
          :disabled="dateType !== 'adv'"
          :getPopupContainer="() => $refs.domRef"
          @change="onChangeUnit"
        />
        <RSelect
          class="w-80"
          :allowClear="false"
          :value="order"
          :options="orderOpts"
          :disabled="dateType !== 'adv'"
          :getPopupContainer="() => $refs.domRef"
          @change="onChangeOrder"
        />
      </div>
      <div>
        <ARadio :checked="timeType === 'now'"
          name="timeType"
          value="now"
          @change="onChangeTimeType"
        >
          此刻
        </ARadio>
      </div>
      <div class="align-center mt-5">
        <ARadio :checked="timeType === 'static'"
          name="timeType"
          value="static"
          @change="onChangeTimeType"
        >
          固定值
        </ARadio>
        <RSelect
          v-model:value="month"
          :allowClear="false"
          :options="monthOpts"
          :disabled="timeType === 'now'"
          :getPopupContainer="() => $refs.domRef"
        />
        <RSelect
          v-model:value="day"
          :allowClear="false"
          :options="dayOpts"
          :disabled="timeType === 'now'"
          :getPopupContainer="() => $refs.domRef"
        />
        <RSelect
          v-model:value="week"
          :allowClear="false"
          :options="weekOpts"
          :disabled="timeType === 'now'"
          :getPopupContainer="() => $refs.domRef"
        />
        <ATimePicker
          v-model:value="time"
          valueFormat="HH:mm:ss"
          :disabled="timeType === 'now'"
          :getPopupContainer="() => $refs.domRef"
          @change="onChangeTime"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.cat-date {
  margin-bottom: 52px;
}
.w-80 {
  width: 80px
}
:deep(.ant-radio-wrapper) {
  span + span {
    flex-grow: 0;
    flex-shrink: 0;
  }
}
</style>
