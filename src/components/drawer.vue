<script setup>
import {
  useSlots,
  computed,
} from 'vue';

const props = defineProps({
  clearAll: Boolean,
});

defineEmits([
  'cancel',
  'ok',
  'update:visible',
]);

const slots = useSlots();
const hasSlotFooter = computed(() => !!slots.footer);
const bodyStyle = computed(() => {
  const style = { position: 'relative' };
  if (props.clearAll) {
    style.padding = 0;
  }
  return style;
});
const headerStyle = computed(() => {
  if (props.clearAll) {
    return { display: 'none' };
  }
  return {};
});

</script>
<template>
  <ADrawer
    destroyOnClose
    width="800px"
    :keyboard="false"
    :bodyStyle="bodyStyle"
    :headerStyle="headerStyle"
    @close="$emit('cancel');$emit('update:visible', false);"
  >
    <template v-for="(n, slotName) of $slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName"
        v-bind="{ ...slotProps }"
      />
    </template>
    <template v-if="!hasSlotFooter && !clearAll"
      #footer
    >
      <div class="justify-end flex-grow">
        <AButton
          @click="$emit('cancel');$emit('update:visible', false);"
        >
          取消
        </AButton>
        <AButton
          class="ml-10"
          type="primary"
          @click="$emit('ok')"
        >
          确认
        </AButton>
      </div>
    </template>
  </ADrawer>
</template>
<style scoped>
</style>

