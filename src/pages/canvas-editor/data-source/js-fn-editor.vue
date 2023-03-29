<script setup>
import {
  ref,
} from 'vue';
import {
  PlayCircleOutlined,
  ExpandOutlined,
  CompressOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons-vue';
import { errorLog } from '@/uses/log';
import runInNewContext from '@/uses/vm';

const props = defineProps({
  value: String,
  placeholder: String,
});

const emit = defineEmits([
  'update:value',
  'input',
  'change',
]);

const fullscreen = ref(false);
const previewFold = ref(true);
const preview = ref('');

async function onClickRun() {
  previewFold.value = false;
  try {
    const result = await runInNewContext(props.value);
    preview.value = JSON.stringify(result);
  } catch (e) {
    errorLog({ e, msg: '执行js出错' });
  }
}

function onInput(value) {
  emit('update:value', value);
  emit('change', value);
  emit('input', value);
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
    <div class="content-section p-relative overflow-hidden">
      <div class="editor-section height-100">
        <Monaco
          class="no-border"
          language="javascript"
          :value="value"
          :placeholder="placeholder"
          @focus="() => previewFold = true"
          @input="onInput"
        />
      </div>
      <div
        class="preview-section p-absolute d-flex white-bg"
        :class="{fold: previewFold}"
      >
        <AButton
          class="flex-0-0 fold-btn m-10"
          size="small"
          @click="previewFold = !previewFold"
        >
          <component
            :is="previewFold ? LeftOutlined : RightOutlined"
          />
        </AButton>
        <div v-if="!previewFold" class="height-100 flex-grow">
          <Monaco
            language="json"
            readonly
            :value="preview"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.js-fn-editor {
  border: 1px solid #ddd;
  background: #fff;

  &.fullscreen {
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;

    .content-section {
      flex-grow: 1;
    }
  }

  .tool-section {
    border-bottom: 1px solid #ddd;
  }

  &:not(.fullscreen) {
    .content-section {
      height: 500px;
    }
  }

  .editor-section {
    margin-right: 51px;
    border-right: 1px solid #ddd;
  }

  .preview-section {
    transition: all 0.3s;
    width: 90%;
    top: 0;
    bottom: 0;
    border-left: 1px solid #eee;

    &.fold {
      left: calc(100% - 50px);
    }

    &:not(.fold) {
      left: 10%;
      box-shadow: 0 -1px 5px 3px #f1f1f1;
    }

    .fold-btn {
    }
  }
}
</style>
