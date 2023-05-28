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
  itemLength: Number,
  column: Object,
  record: Object,
  index: Number,
  inConfirm: Boolean,
});

const emit = defineEmits(['click']);

const isOp = computed(() => !!props.column?.isOperator);

const isHtml = computed(() => props.item?.html || props.column?.isHtml);

const isImg = computed(() => {
  const { valueType } = props?.column || {};
  return valueType === 'picture' || valueType === 'img';
});

const isLink = computed(() => {
  const { valueType } = props?.column || {};
  return valueType === 'link' || /^https?:\/\//.test(unref(cellText));
});

const is = computed(() => {
  let comp = props.item?.component || props.column?.component;
  if (!comp) {
    if (unref(isImg)) {
      comp = ImgLink;
    } else if (unref(isLink)) {
      comp = 'a';
    }
  }
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
    && text // 过滤text = null的情况
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

function getCompProps() {
  if (unref(isOp)) {
    return props.item?.compProps;
  }
  if (unref(isImg)) {
    return {
      href: unref(cellText),
    };
  }
  if (unref(isLink)) {
    return {
      href: unref(cellText),
      target: '_blank',
      class: props.itemLength > 1 ? 'd-block' : '',
    };
  }
  const compProps = {
    ...props.column?.compProps,
    ...props.item?.compProps,
  };
  if (!/ellipsis/.test(compProps.class)) {
    return compProps;
  }
  return { title: unref(cellText), ...compProps };
}

function onCompClick(e) {
  if (props.inConfirm) {
    e.stopPropagation();
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
  <template v-else>
    {{cellText}}
  </template>
</template>
<style scoped>
</style>
