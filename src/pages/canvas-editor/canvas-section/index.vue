<script setup>
</script>
<template>
  <div class="canvas-section p-20 height-100">
    <div class="canvas-bg height-100">

    </div>
  </div>
</template>
<style scoped>
.canvas-section {
  background: #fafafa;
  .canvas-bg {
    background: linear-gradient(transparent 9px, #E1E4EA 10px),
                linear-gradient(90deg, transparent 9px, #E1E4EA 10px),
                linear-gradient(90deg, transparent 49px, rgba(0, 0, 0, .1) 50px),
                linear-gradient(transparent 49px, rgba(0, 0, 0, .1) 50px),
                #FcFcFc;
    background-size: 10px 10px, 10px 10px, 50px 50px, 50px 50px;
    box-shadow: 0 0 10px 1px #E1E4EA, 0 0 15px 1px #E1E4EA;
    transition: all .5s;
  }
}
</style>
