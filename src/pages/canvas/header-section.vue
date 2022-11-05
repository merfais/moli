<script setup>
import {
  ref,
} from 'vue';

const props = defineProps({
  name: String,
  autoName: String,
});

const emit = defineEmits([
  'changeName',
]);

const nameEdited = ref(false);
const nameInput = ref('');

function onClickEditName() {
  nameEdited.value = !nameEdited.value;
  // 修改
  if (nameEdited.value) {
    nameInput.value = props.name || props.autoName;
    return;
  }
  const name = nameInput.value.trim();
  // 保存
  if (name !== props.autoName) {
    emit('changeName', { name });
  }
}

</script>
<template>
  <section class="header-section">
    <AInput v-if="nameEdited"
      v-model:value="nameInput"
      class="name-input"
      size="small"
      @blur="onClickEditName"
    />
    <div v-else class="name-text">
      {{name || autoName}}
    </div>
  </section>
</template>
<style scoped>
.header-section {
  height: 50px;
  box-shadow: 0px 1px 8px #f1f1f1;
}
</style>
