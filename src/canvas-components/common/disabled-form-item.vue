<script setup>
import {
  shallowRef,
} from 'vue';
import { Form } from 'ant-design-vue';

const formItemContext = Form.useInjectFormItemContext();

const emit = defineEmits([
  'update:value',
]);

const trueValue = shallowRef('');
const options = shallowRef([]);

function onUpdateValue(value) {
  emit('update:value', value);
  formItemContext.onFieldChange();
}

</script>
<script>
export default { inheritAttrs: false };
</script>
<template>
  <div class="align-center">
    <ARadioGroup
      v-bind="$attrs"
      @update:value="onUpdateValue"
    >
      <ARadio :value="false">不禁用</ARadio>
      <ARadio class="mr-0"
        :value="trueValue"
      >
        当数据源
      </ARadio>
    </ARadioGroup>
    <RSelect class="var-selector mr-10"
      v-model:value="trueValue"
      :options="options"
    />
    有值时禁用
  </div>
</template>
<style scoped>
.var-selector {
  width: 200px;
}
</style>
