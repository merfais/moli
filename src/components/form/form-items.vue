<script setup>
import {
  shallowRef,
  ref,
  unref,
  watch,
} from 'vue';
import {
  set,
  omit,
  pick,
  forEach,
} from 'lodash-es';
import FormItem from './form-item';

const props = defineProps({
  items: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
  'update',
]);

const formItemValueMap = ref({});
const compItemValueMap = ref({});
const innerFormItems = shallowRef({});

watch(() => unref(props.items), () => {
  const formItems = {};
  const formValueMap = {};
  const compValueMap = {};
  forEach(unref(props.items), (item, key) => {
    const { isNotFormItem, path, value, compSlots = {} } = item;
    formItems[key] = {
      key,
      path: path || key,
      ...pick(item, ['onUpdate']),
    };
    const compProps = { ...item.compProps };

    // 打上isNotFormItem标记或使用了slot，则不用formItem渲染
    if (isNotFormItem || item.slot) {
      Object.assign(compProps, pick(item, ['class']));
      Object.assign(formItems[key], {
        compProps,
        compSlots,
        ...pick(item, [
          'component',
          'slot',
          'compInnerText',
        ]),
      });

      Object.assign(compValueMap, { [key]: value });
    } else {
      const { label } = item;
      if (compProps?.placeholder === undefined) {
        if (/^(a|r)-?(input(-?(search|number))?|textarea)$/i.test(item.component)) {
          set(compProps, 'placeholder', `请输入${label}`);
        } else if (/^((a|r)-?(select|cascader)|color-?picker)$/i.test(item.component)) {
          set(compProps, 'placeholder', `请选择${label}`);
        }
      }
      // formProps只对formItem生效
      Object.assign(formItems[key], {
        formProps: {
          ...omit(item, [
            'onUpdate',
            'isNotFormItem',
            'value',
            'path',
          ]),
          path: formItems[key].path,
          compSlots,
          compProps,
        },
      });

      // formItem需要生成<a-form>组件需要的model接口数据
      // 如果value是ref值，会造成死循环，可能是antd的bug
      Object.assign(formValueMap, { [key]: unref(value) });
    }
  });
  innerFormItems.value = formItems;
  formItemValueMap.value = formValueMap;
  compItemValueMap.value = compValueMap;
}, { immediate: true });

function onUpdate(value, item) {
  const { key, path, onUpdate, formProps } = item;
  let { compProps } = item;
  if (formProps) {
    Object.assign(unref(formItemValueMap), { [key]: value });
    compProps = formProps.compProps;
  } else {
    Object.assign(unref(compItemValueMap), { [key]: value });
  }

  if (typeof compProps['onUpdate:value'] === 'function') {
    compProps['onUpdate:value'](value);
  }
  const payload = { key, path, item: compProps, payload: value };
  if (typeof compProps.onUpdate === 'function') {
    compProps.onUpdate(payload);
  }
  if (typeof onUpdate === 'function') {
    onUpdate(payload);
  }
  emit('update', payload);
}

</script>
<template>
  <template v-for="(item, key) in innerFormItems" :key="key">
    <FormItem v-if="item.formProps"
      v-bind="item.formProps"
      :value="formItemValueMap[key]"
      :name="key"
      @update:value="onUpdate($event, item)"
    />
    <slot v-else-if="item.slot"
      :name="item.slot"
      :value="compItemValueMap[key]"
      :text="item.compInnerText"
      v-bind="item.compProps"
    />
    <component v-else
      :is="item.component"
      :value="compItemValueMap[key]"
      v-bind="item.compProps"
      @update:value="onUpdate($event, item)"
    >
      <template v-for="(slotItem, name) in item.compSlots"
        #[name]="slotProps"
        :key="name"
      >
        <component v-if="slotItem.component"
          :is="slotItem.component"
          v-bind="{...slotProps, ...slotItem.compProps}"
        />
      </template>
      <template v-if="item.compInnerText">
        {{item.compInnerText}}
      </template>
    </component>
  </template>
</template>
<style scoped>
</style>
