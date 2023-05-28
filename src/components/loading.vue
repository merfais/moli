<script setup>
defineProps({
  size: {
    type: String,
    default: '50px',
  },
});

</script>
<template>
  <div class="content" :style="{ width: size, height: size }">
    <div v-for="i in 5" :key="i" :class="`rect${i}`" />
  </div>
</template>
<style scoped>
.content {
  font-size: 0px; /* 对inline-block存在间隙的hack */

  > div {
    width: 10%;
    margin: 0 5%;
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

</style>
