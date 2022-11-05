<script setup>
import {
  computed,
  onMounted,
  ref,
  unref,
} from 'vue';
import LargeJsonViewer from './large-json-viewer';

const props = defineProps({
  data: { // 传入的json数据
    type: [Object, Array],
    required: true,
  },
  jsonKey: { // json的key值，用于第二层及二层以上的组件的key值
    type: String,
    default: '',
  },
  closed: { // 是否折叠
    type: Boolean,
    default: false,
  },
  isLast: { // 是否是最后一行
    type: Boolean,
    default: true,
  },
  fontSize: { // 字体大小
    type: Number,
    default: 14,
  },
  lineHeight: { // 行高
    type: Number,
    default: 24,
  },
  deep: { // 展开深度
    type: Number,
    default: 3,
  },
  currentDeep: { // 当前为递归的第几层
    type: Number,
    default: 1,
  },
});

const innerclosed = ref(props.closed);
const templateDeep = ref(props.currentDeep);
const visible = ref(false);

const dataIsArray = computed(() => {
  return getDataType(props.data) === 'array';
});

const dataLength = computed(() => {
  return unref(dataIsArray)
    ? props.data.length
    : Object.keys(props.data).length;
});

const prefix = computed(() => {
  return unref(dataIsArray) ? '[' : '{';
});

const subfix = computed(() => {
  // 如果是空数组或空对象
  if ((Array.isArray(props.data) && !props.data.length)
    || (getDataType(props.data) === 'object' && !Object.keys(props.data).length)
  ) {
    return '';
  }
  const p1 = unref(dataIsArray) ? ']' : '}';
  const p2 = props.isLast ? '' : ',';
  return `${p1}${p2}`;
});

const items = computed(() => {
  const json = props.data;

  if (unref(dataIsArray)) {
    return json.map((item) => {
      const isJSON = isObjectOrArray(item);
      return {
        value: item,
        isJSON,
        key: '',
      };
    });
  }
  return Object.keys(json).map((key) => {
    const item = json[key];
    const isJSON = isObjectOrArray(item);
    return {
      value: item,
      isJSON,
      key,
    };
  });
});

function getDataType(data) {
  // eslint-disable-next-line no-underscore-dangle
  return data && data._isBigNumber
    ? 'number'
    : Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}

function isObjectOrArray(source) {
  return ['array', 'object'].includes(getDataType(source));
}

function toggleClose() {
  if (unref(dataLength) === 0) {
    return;
  }
  innerclosed.value = !unref(innerclosed);
}

function isClose() {
  return unref(templateDeep) + 1 > props.deep;
}

function formatValue(data) {
  // eslint-disable-next-line no-underscore-dangle
  if (data && data._isBigNumber) {
    return data.toString(10);
  }
  return data;
}

function getText(item, index) {
  const marker = getDataType(item.value) === 'string' ? '"' : '';
  const separator = index === unref(items).length - 1 ? '' : ',';
  return `${marker}${formatValue(item.value)}${marker}${separator}`;
}

onMounted(() => {
  setTimeout(() => {
    visible.value = true;
  }, 0);
});

</script>
<template>
  <div v-if="visible"
    :class="['json-view-container',`deep-${currentDeep}`]"
  >
    <div
      :class="['json-view', dataLength ? 'closeable' : '']"
      :style="{fontSize:fontSize+'px',lineHeight:lineHeight+'px'}"
    >
      <span v-if="dataLength"
        @click="toggleClose"
        class="angle"
      >
        <svg v-if="innerclosed"
          fill="#747983"
          width="1em"
          height="1em"
          viewBox="0 0 1792 1792"
          style="vertical-align: middle; color: rgb(42, 161, 152); height: 1em; width: 1em;"
        >
          <path d="M1344 800v64q0 14-9 23t-23 9h-352v352q0 14-9 23t-23
            9h-64q-14 0-23-9t-9-23v-352h-352q-14 0-23-9t-9-23v-64q0-14
            9-23t23-9h352v-352q0-14 9-23t23-9h64q14 0 23 9t9 23v352h352q14
            0 23 9t9 23zm128 448v-832q0-66-47-113t-113-47h-832q-66 0-113
            47t-47 113v832q0 66 47 113t113 47h832q66 0
            113-47t47-113zm128-832v832q0 119-84.5 203.5t-203.5 84.5h-832q-119
            0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q119
            0 203.5 84.5t84.5 203.5z"
          ></path>
        </svg>
        <svg v-if="!innerclosed"
          fill="#747983"
          width="1em"
          height="1em"
          viewBox="0 0 1792 1792"
          style="vertical-align: middle; color: rgb(88, 110, 117); height: 1em; width: 1em;"
        >
          <path d="M1344 800v64q0 14-9 23t-23 9h-832q-14 0-23-9t-9-23v-64q0-14
            9-23t23-9h832q14 0 23 9t9 23zm128
            448v-832q0-66-47-113t-113-47h-832q-66 0-113 47t-47 113v832q0 66 47
            113t113 47h832q66 0 113-47t47-113zm128-832v832q0 119-84.5
            203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119
            84.5-203.5t203.5-84.5h832q119 0 203.5 84.5t84.5 203.5z"
          ></path>
        </svg>
      </span>
      <div class="content-wrap">
        <p :class="['first-line',dataLength>0?'pointer':'']"
          @click="toggleClose"
        >
          <span v-if="jsonKey" class="json-key">
            "{{jsonKey}}":
          </span>
          <span v-if="dataLength">
            {{prefix}}{{innerclosed ? ('...' + subfix) : ''}}
            <span class="json-note">
              {{innerclosed ? (dataLength+' items') : ''}}
            </span>
          </span>
          <span v-else>
            {{`${dataIsArray ? '[]' : '{}'}${isLast?'':','}`}}
          </span>
        </p>
        <div v-if="!innerclosed && dataLength" class="json-body">
          <template v-for="(item, index) in items"
            :key="index"
            >
            <LargeJsonViewer v-if="item.isJSON"
              :closed="isClose()"
              :data="item.value"
              :jsonKey="item.key"
              :currentDeep="templateDeep+1"
              :deep="deep"
              :fontSize="fontSize"
              :lineHeight="lineHeight"
              :isLast="index === items.length - 1"
            />
            <p v-else class="json-item">
              <span class="json-key">
                {{(dataIsArray ? '' : '"' + item.key + '":')}}
              </span>
              <span :class="['json-value',getDataType(item.value)]">
                {{getText(item, index)}}
              </span>
            </p>
          </template>
          <span v-if="!innerclosed" class="base-line"></span>
        </div>
        <p v-if="!innerclosed " class="last-line">
          <span>{{subfix}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.json-view-container {
  background-color: #fff;
  &.deep-1{
    // overflow: auto;
    padding-right: 10px;
  }
  .json-view {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    padding-left: 2rem;
    box-sizing: border-box;
    font-family: Consolas !important;
    cursor: default;
    .json-note {
      color: #909399;
      font-size: 12px;
      font-style: italic;
    }

    .json-key {
      color: #8c6325;
    }

    .json-value {
      display: inline-block;
      color:#57b73b;
      word-break: break-all;
      white-space: normal;
      &.number{
        color: #2d8cf0;
      }
      &.string{
        color:#57b73b;
      }
      &.boolean{
        color: #eb3324;
      }
      &.null{
        color: #eb3324;
      }
    }

    .json-item {
      margin: 0;
      padding-left: 2rem;
      display: flex;
    }

    .first-line {
      padding: 0;
      margin: 0;

      &.pointer {
        cursor: pointer!important;
      }
    }

    .json-body {
      position: relative;
      padding: 0;
      margin: 0;

      .base-line {
        position: absolute;
        height: 100%;
        border-left: 1px dashed #bbb;
        top: 0;
        left: 2px;

        &:hover {}
      }
    }

    .last-line {
      padding: 0;
      margin: 0;
    }

    .angle {
      position: absolute;
      display: block;
      cursor: pointer;
      float: left;
      width: 20px;
      text-align: center;
      /*left: ~"calc(2rem - 18px)";*/
      left: 12px;
    }
  }
}
</style>
