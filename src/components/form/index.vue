<script setup>
import {
  shallowReactive,
  ref,
  unref,
  onMounted,
  watch,
} from 'vue';
import {
  forEach,
} from 'lodash-es';
import IForm from './form';
import FormItems from './form-items';

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

const antdFormModel = ref({});

watch(() => unref(props.formItems), () => {
  const valueMap = {};
  forEach(unref(props.formItems), (item, key) => {
    const { value } = item;
    Object.assign(valueMap, { [key]: value });
  });
  antdFormModel.value = valueMap;
}, { immediate: true });

function onUpdate(options) {
  const { key, payload } = options;
  Object.assign(unref(antdFormModel), { [key]: payload });
  emit('update', options);
}

const formRef = ref();
const exposeObj = shallowReactive({});
defineExpose(exposeObj);
onMounted(() => {
  Object.assign(exposeObj, { ...formRef.value });
});

</script>
<template>
  <IForm
    ref="formRef"
    :loading="loading"
    :model="antdFormModel"
  >
    <FormItems
      :items="formItems"
      @update="onUpdate"
    >
      <template v-for="(n, slotName) of $slots"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot :name="slotName"
          v-bind="{ ...slotProps }"
        />
      </template>
    </FormItems>
    <slot />
  </IForm>
</template>
<style scoped>
</style>
