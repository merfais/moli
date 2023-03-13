<script setup>
import {
  get,
} from 'lodash-es';
import {
  computed,
  unref,
} from 'vue';
import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import { Form } from 'ant-design-vue';

const formItemContext = Form.useInjectFormItemContext();

const props = defineProps({
  repeat: Boolean,
  is: [String, Object, Function],
  value: {},
});

const emit = defineEmits([
  'update:value',
]);

const values = computed(() => {
  if (props.repeat) {
    if (Array.isArray(props.value)) {
      return props.value.length ? props.value : [undefined];
    }
    return [undefined];
  }
  return [props.value];
});
const model = computed(() => {
  const compArr = ['ACheckbox', 'a-checkbox', 'ASwitch', 'a-switch'];
  if (compArr.includes(props.is)) {
    return 'checked';
  }
  return 'value';
});

function update(value) {
  emit('update:value', value);
  formItemContext.onFieldChange();
}

function onUpdate(e) {
  const val = get(e, 'target.value', e);
  update(val);
}

function onUpdateOne(e, idx) {
  const val = get(e, 'target.value', e);
  const value = [...unref(values)];
  value[idx] = val;
  update(value);
}

function onClickAdd(index) {
  const value = [...unref(values)];
  value.splice(index + 1, 0, undefined);
  update(value);
}

function onClickRemove(index) {
  const value = [...unref(values)];
  value.splice(index, 1);
  update(value);
}

</script>
<script>
export default { inheritAttrs: false };
</script>
<template>
  <template v-if="repeat">
    <div v-for="(val, idx) in values"
      :key="idx"
      class="d-flex op-btn"
    >
      <component
        :is="is"
        class="flex-grow"
        :[model]="val"
        v-bind="$attrs"
        @[`update:${model}`]="onUpdateOne($event, idx)"
      />
      <RButton
        class="ml-5 mt-5"
        size="small"
        :disabled="$attrs.disabled"
        @click="onClickAdd(idx)"
      >
        <PlusOutlined />
      </RButton>
      <AButton
        class="mt-5"
        :disabled="values.length === 1 || $attrs.disabled"
        danger
        type="link"
        size="small"
        @click="onClickRemove(idx)"
      >
        <DeleteOutlined />
      </AButton>
    </div>
  </template>
  <component v-else
    :is="is"
    :[model]="value"
    v-bind="$attrs"
    @[`update:${model}`]="onUpdate"
  />
</template>
<style scoped>
.op-btn + .op-btn {
  margin-top: 5px;
}
</style>
