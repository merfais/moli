<script setup>
import {
  computed,
  watchEffect,
  reactive,
  ref,
  unref,
} from 'vue';
import {
  omit,
  get,
  forEach,
} from 'lodash-es';

const props = defineProps({
  // form-item 的 label
  label: [Object, String],
  // 使用什么组件渲染
  component: [String, Object],
  path: [String, Array],
  // 组件的值
  value: {},
  // 组件除了值以外的其他props参数
  compProps: {
    type: Object,
    default: () => ({}),
  },
  // 组件的slot：{ [slotName: string]: { component: string|Object, props: Object } }
  compSlots: {
    type: Object,
    default: () => ({}),
  },
  compInnerText: String,
  class: {
    type: String,
    default: 'col-24',
  },
});

defineEmits([
  'update:value',
]);

const hiddenDomRef = ref();

const model = computed(() => {
  const compArr = ['ACheckbox', 'a-checkbox', 'ASwitch', 'a-switch'];
  if (compArr.includes(props.component)) {
    return 'checked';
  }
  return 'value';
});

const restCompProps = computed(() => {
  const result = omit(props.compProps, [
    'onUpdate:value',
  ]);
  return result;
});

const label = computed(() => get(props.label, 'text', props.label));
const title = computed(() => {
  const t = get(props.label, 'title');
  if (t) {
    return t;
  }
  if (props.path) {
    if (Array.isArray(props.path)) {
      return `${props.path.join('.')}`;
    }
    return props.path;
  }
  return unref(label);
});

const className = computed(() => {
  if (!props.class) {
    return 'col-24';
  }
  if (props.class.indexOf('col-') === -1) {
    return `col-24 ${props.class}`;
  }
  return props.class;
});

const slotConfs = {
  value: reactive({}),
  model: {},
  onUpdateValue: {},
};

watchEffect(() => {
  forEach(props.compSlots, (item, name) => {
    const value = get(item, 'compProps.value', get(item, 'value'));
    slotConfs.value[name] = value;
    const model = item.component === 'ACheckbox' ? 'checked' : 'value';
    slotConfs.model[name] = model;
    const onUpdateValue = (e) => {
      slotConfs.value[name] = get(e, 'target.value', e);
    };
    slotConfs.onUpdateValue[name] = onUpdateValue;
  });
});

function getSlotProps(name, item, slotProps = {}) {
  const props = { ...slotProps, ...item.compProps };
  delete props.value;
  props[slotConfs.model[name]] = slotConfs.value[name];
  return props;
}

function getPopupContainer() {
  const domRef = unref(hiddenDomRef);
  const el = domRef?.parentNode?.parentNode?.parentNode;
  return el || document.body;
}

</script>
<template>
  <AFormItem :class='className'>
    <template v-if="label" #label>
      <span :title="title">
        {{label}}
      </span>
    </template>
    <div ref="hiddenDomRef" class="d-none"/>
    <component :is="component"
      :getPopupContainer="getPopupContainer"
      v-bind="restCompProps"
      :[model]="value"
      @[`update:${model}`]="$emit('update:value', $event)"
    >
      <template v-for="(item, name) in compSlots"
        #[name]="slotProps"
        :key="name"
      >
        <component v-if="item.component"
          :is="item.component"
          v-bind="getSlotProps(name, item, slotProps)"
          @update:value="slotConfs.onUpdateValue[name]"
        >
          <template v-if="item.compInnerText">
            {{item.compInnerText}}
          </template>
        </component>
        <component v-else-if="typeof item === 'function'"
          :is="item"
          v-bind="slotProps"
        />
        <template v-else-if="item">
          {{item}}
        </template>
      </template>
      <template v-if="compInnerText">
        {{compInnerText}}
      </template>
    </component>
    <slot />
  </AFormItem>
</template>
<style scoped>
.ant-form-item {
  :deep(.ant-input-number),
  :deep(.ant-picker) {
    width: 100%;
  }

  :deep(.ant-form-item-label) {
    & > label > span {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>

