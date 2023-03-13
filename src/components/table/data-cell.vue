<script setup>
import {
  computed,
  unref,
} from 'vue';
import {
  isEmpty,
} from 'lodash-es';
import ImgLink from '../img-link';

const props = defineProps({
  itemKey: [String, Number],
  item: {},
  column: Object,
  record: Object,
  index: Number,
  inConfirm: Boolean,
});

const emit = defineEmits(['click']);

const is = computed(() => {
  const comp = props.item?.component || props.column?.component;
  if (!comp) {
    return;
  }
  if (/^a-?button|a-?tag$/i.test(comp) && unref(cellText) === undefined) {
    return;
  }
  return comp;
});


const cellText = computed(() => {
  let text = props.item;
  // dataSource中字段的值是 object，可能使用了component渲染
  // 判断component是否有值，取item.text 或固定值column.compInnerText
  if (typeof text === 'object'
    && (props.column?.component || props.item?.component)
  ) {
    text = text.text || props.column?.compInnerText;
  }

  // 如果最终的text是object，判断是否为空，否则string化
  if (typeof text === 'object') {
    return isEmpty(text) ? undefined : JSON.stringify(text);
  }

  // 其他格式直接渲染
  return text;
});

const cellHtml = computed(() => {
  return props.item?.html || unref(cellText);
});

const isOp = computed(() => !!props.column?.isOperator);

const isHtml = computed(() => props.item?.html || props.column?.isHtml);

const isImg = computed(() => {
  const { valueType } = props?.column || {};
  return valueType === 'picture' || valueType === 'img';
});

const isUrl = computed(() => /^https?:\/\//.test(unref(cellText)));

function getCompProps() {
  if (unref(isOp)) {
    return props.item?.compProps;
  }
  return {
    ...props.column?.compProps,
    ...props.item?.compProps,
  };
}

function onCompClick(e) {
  if (props.inConfirm) {
    emit('click', e);
    return;
  }
  if (typeof props.item?.onClick === 'function') {
    return props.item.onClick({ e, ...props });
  }
  if (typeof props.column?.onClick === 'function') {
    return props.column.onClick({ e, ...props });
  }
}

function onUpdateValue(value) {
  if (typeof props.column?.['onUpdate:value'] === 'function') {
    props.column['onUpdate:value']({ value, ...props });
  }
}

</script>
<template>
  <component v-if="inConfirm && is && isHtml"
    :is="is"
    v-bind="getCompProps()"
    :data-key="itemKey"
    v-html="cellHtml"
    @click="onCompClick"
  />
  <component v-else-if="inConfirm && is"
    :is="is"
    v-bind="getCompProps()"
    :data-key="itemKey"
    @click="onCompClick"
  >
    {{cellText}}
  </component>
  <span v-else-if="inConfirm"
    :data-key="itemKey"
    @click="onCompClick"
  >
    {{cellText}}
  </span>
  <template v-else-if="is">
    <component v-if="isHtml"
      :is="is"
      v-bind="getCompProps()"
      @click="onCompClick"
      @update:value="onUpdateValue"
      v-html="cellHtml"
    />
    <component v-else
      :is="is"
      v-bind="getCompProps()"
      @click="onCompClick"
      @update:value="onUpdateValue"
    >
      {{cellText}}
    </component>
  </template>
  <template v-else-if="isHtml">
    <span v-html="cellHtml" />
  </template>
  <ImgLink v-else-if="isImg"
    :href="cellText"
  />
  <a v-else-if="isUrl"
    :href="cellText"
    target="_blank"
    >
    {{cellText}}
  </a>
  <template v-else>
    {{cellText}}
  </template>
</template>
<style scoped>
</style>
