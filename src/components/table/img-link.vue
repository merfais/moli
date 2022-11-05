<script setup>
</script>
<template>
  <a v-if="$attrs.href"
    class="img-link d-inline-block"
    target="_blank"
    title="点击查看大图"
  >
    <img :src="$attrs.href" class="img" />
  </a>
</template>
<style scoped>
.img-link {
  width: 80px;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 2px 0;

  .img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
}

.img-link:nth-child(even) {
  margin-left: 4px;
}
</style>
