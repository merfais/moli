<script setup>
import {
  shallowRef,
  shallowReactive,
  ref,
  unref,
  onMounted,
  watchEffect,
} from 'vue';
import {
  omit,
  pick,
  forEach,
} from 'lodash-es';
import FormItem from './form-item';

const props = defineProps({
  formItems: {
    type: Object,
    default: () => ({}),
  },
  loading: Boolean,
});

const emit = defineEmits([
  'update',
]);

const dftProps = {
  layout: 'inline',
  labelCol: { style: { minWidth: '100px' } },
};

const antdFormModel = ref({});
const innerFormValues = ref({});
const innerFormItems = shallowRef({});

watchEffect(() => {
  const formItems = {};
  antdFormModel.value = {};
  innerFormValues.value = {};
  forEach(unref(props.formItems), (item, key) => {
    const {
      isNotFormItem, path, value, compSlots = {},
    } = item;
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

      Object.assign(innerFormValues.value, { [key]: value });
    } else {
      // formProps只对formItem生效
      Object.assign(formItems[key], {
        formProps: {
          ...omit(item, [
            'onUpdate',
            'isNotFormItem',
            'value',
            'path',
          ]),
          compSlots,
          compProps,
        },
      });

      // formItem需要生成<a-form>组件需要的model接口数据
      // 如果value是ref值，会造成死循环，可能是antd的bug
      Object.assign(antdFormModel.value, { [key]: unref(value) });
    }
  });
  innerFormItems.value = formItems;
});

const onUpdate = (value, item) => {
  const {
    key, path, onUpdate, formProps,
  } = item;
  let { compProps } = item;
  if (formProps) {
    Object.assign(antdFormModel.value, { [key]: value });
    compProps = formProps.compProps;
  } else {
    Object.assign(innerFormValues.value, { [key]: value });
  }

  if (typeof compProps['onUpdate:value'] === 'function') {
    compProps['onUpdate:value'](value);
  }
  const payload = { path, item: compProps, payload: value };
  if (typeof compProps.onUpdate === 'function') {
    compProps.onUpdate(payload);
  }
  if (typeof onUpdate === 'function') {
    onUpdate(payload);
  }
  emit('update', payload);
};

const formRef = ref();
const exposeObj = shallowReactive({});
defineExpose(exposeObj);
onMounted(() => {
  Object.assign(exposeObj, { ...formRef.value });
});

</script>
<template>
  <AForm
    class="form-wrapper"
    v-bind="dftProps"
    :model="antdFormModel"
    ref="formRef"
  >
    <template v-for="(item, key) in innerFormItems" :key="key">
      <FormItem v-if="item.formProps"
        v-bind="item.formProps"
        :value="antdFormModel[key]"
        :name="key"
        @update:value="onUpdate($event, item)"
      />
      <slot v-else-if="item.slot"
        :name="item.slot"
        :value="item.value"
        v-bind="item.compProps"
      />
      <component v-else
        :is="item.component"
        :value="innerFormValues[key]"
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
    <slot />
    <div v-if='loading' class="cover flex-center loading">
      <ASpin />
    </div>
  </AForm>
</template>
<style scoped>
.form-wrapper {
  position: relative;
}

.ant-form-inline {
  :deep(.ant-form-item) {
    margin-right: 0;
    margin-bottom: 24px;

    &:not(.col-24) {
      padding-left: 10px;
    }

    &.ant-form-item-with-help {
      margin-bottom: 0;
    }

    &.p-0 {
      padding: 0;
    }
  }

}

.loading {
  min-height: 50px;
}

</style>
