<script setup>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

</script>
<template>
  <VueJsonPretty
    class="json-viewer"
    showLength
    showLine
    virtual
    :virtualLines="100"
    deepCollapseChildren
    collapsedOnClickBrackets
  />
</template>
<style scoped>
.json-viewer {
  height: 100%;
  padding-left: 20px;
}
</style>
