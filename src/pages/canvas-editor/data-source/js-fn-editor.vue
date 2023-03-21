<script setup>
import {
  ref,
} from 'vue';
import {
  PlayCircleOutlined,
  ExpandOutlined,
  CompressOutlined,
} from '@ant-design/icons-vue';

const fullscreen = ref(false);

function onClickRun() {

}
</script>
<template>
  <div class="js-fn-editor width-100"
    :class="{ fullscreen }"
  >
    <div class="tool-section p-5 d-flex flex-0-0">
      <div class="flex-grow flex-center">
        <AButton
          type="primary"
          size="small"
          @click="onClickRun"
        >
          运行测试
          <PlayCircleOutlined />
        </AButton>
      </div>
      <RButton
        size="small"
        @click="fullscreen = !fullscreen"
      >
        <component
          :is="fullscreen ? CompressOutlined : ExpandOutlined"
        />
      </RButton>
    </div>
    <div class="editor-section">
      <Monaco
        class="no-border"
        language="javascript"
      />
    </div>
  </div>
</template>
<style scoped>
.js-fn-editor {
  border: 1px solid #ddd;
  background: #fff;
  transition: all 1s;

  &.fullscreen {
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;

    .editor-section {
      flex-grow: 1;
    }
  }

  .tool-section {
    border-bottom: 1px solid #ddd;
  }

  &:not(.fullscreen) {
    .editor-section {
      height: 500px;
    }
  }
}
</style>
