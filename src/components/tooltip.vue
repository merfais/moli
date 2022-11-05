<template>
  <ATooltip
    :getPopupContainer="() => $refs.container"
    :zIndex="1"
  >
    <div ref="container" class="container" />
    <slot />
    <template #title>
      <slot name="title" />
    </template>
  </ATooltip>
</template>
<style scoped>
.container {
  position: relative;

  :deep(.ant-tooltip) {
    max-width: unset;
  }

  :deep(.ant-tooltip-arrow) {
    z-index: 1;

    .ant-tooltip-arrow-content {
      background: #fff;
    }
  }
  :deep(.ant-tooltip-inner) {
    color: inherit;
    background: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
  }
}
</style>
