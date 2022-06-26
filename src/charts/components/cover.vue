<script setup>
import { computed } from 'vue';

const props = defineProps({
  loading: Boolean,
  errorMsg: String,
  empty: Boolean,
});

const visible = computed(() => props.loading || props.errorMsg || props.empty);
const wrapperStyle = computed(() => {
  if (props.loading || props.errorMsg) {
    return { background: '#fff' };
  }
  if (props.empty) {
    return { background: 'transparent' };
  }
  return { background: '#fff' };
});

</script>
<template>
  <div v-show="visible"
    class="cover-wrapper"
    :style="wrapperStyle"
  >
    <div v-if="loading" class="content">
      <div v-for="i in 5" :key="i" :class="`rect${i}`" />
    </div>
    <template v-else-if="errorMsg">
      <slot name="error" :errorMsg="errorMsg">
        <p class="error-msg">出错：{{errorMsg}}</p>
      </slot>
    </template>
    <template v-else-if="empty">
      <slot name="empty">
        <p class="empty">暂 无 数 据</p>
      </slot>
    </template>
  </div>
</template>
<style scoped>
@keyframes stretch {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1.0);
  }
}
.cover-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  .content {
    font-size: 0px; /* 对inline-block存在间隙的hack */
    width: 60px;
    height: 60px;

    > div {
      width: 5px;
      margin: 0 2.5px;
      background-color: #0052d9;
      height: 100%;
      display: inline-block;
      animation: stretch 2s infinite ease-in-out;
    }

    .rect2 {
      animation-delay: -1.8s;
    }

    .rect3 {
      animation-delay: -1.6s;
    }

    .rect4 {
      animation-delay: -1.4s;
    }

    .rect5 {
      animation-delay: -1.2s;
    }
  }

  .error-msg {
    font-size: 13px;
    color: #ff4d4f;
  }

  .empty {
    font-size: 20px;
    margin: 0;
  }
}
</style>
