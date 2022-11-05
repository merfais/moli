<script setup>
const props = defineProps({
  column: Object,
  record: Object,
  index: Number,
  item: {},
  dataKey: String,
  // props.onClick接口不可直接使用，做这个接口只是为了antd不报warning,
  // antd在设计事件接口时，并未按照vue的习惯，反而采用了react的思想，
  // 对事件接口限制了function校验，但vue是支持合并事件回调的function为array类型
  // 不写这样的接口定义，就会报warning，这个接口实际意义不大
  onClick: Function,
});

function onClick(e) {
  if (props.item?.onClick) {
    const { dataKey: key, ...rest } = props;
    props.item.onClick({ e, ...rest, key });
  }
  if (typeof props.onClick === 'function') {
    props.onClick(e);
  }
}

</script>
<template>
  <component
    :is="item.component"
    v-bind="item.compProps"
    :data-key="dataKey"
    @click.stop="onClick"
  >
    {{item.text}}
  </component>
</template>
<style scoped>
</style>
