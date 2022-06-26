<script setup>
import {
  useSlots,
  computed,
} from 'vue';

defineEmits([
  'cancel',
  'ok',
  'update:visible',
]);

const slots = useSlots();
const hasSlotFooter = computed(() => !!slots.footer);

</script>
<template>
  <ADrawer
    destroyOnClose
    width="800px"
    :keyboard="false"
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
    <template v-if="!hasSlotFooter"
      #footer
    >
      <div class="drawer-footer">
        <AButton
          class="footer-btn"
          @click="$emit('cancel');$emit('update:visible', false);"
        >
          取消
        </AButton>
        <AButton
          class="footer-btn"
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
.drawer-footer {
  display: flex;
  justify-content: flex-end;
}

.footer-btn {
  margin-left: 10px;
}
</style>
