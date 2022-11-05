<script setup>
import { computed } from 'vue';
import { Form } from 'ant-design-vue';

Form.useInjectFormItemContext();

const props = defineProps({
  multiple: {
    type: Boolean,
    default: true,
  },
});

const data = [{
  label: '选项A',
  value: 'A',
}, {
  label: '选项B',
  value: 'B',
}, {
  label: '选项C',
  value: 'C',
}];

const options = computed(() => {
  if (props.multiple) {
    return [{
      label: '下拉框',
      value: 'ASelect',
    }, {
      label: '多选框',
      value: 'CheckboxGroup',
    }, {
      label: '按钮式',
      value: 'ButtonCheckboxGroup',
    }];
  }
  return [{
    label: '下拉框',
    value: 'ASelect',
  }, {
    label: '单选框',
    value: 'ARadioGroup',
  }, {
    label: '按钮式',
    value: 'ButtonRadioGroup',
  }];
});

const comps = computed(() => {
  if (props.multiple) {
    return [{
      component: 'ASelect',
      value: ['A', 'B'],
      props: {
        options: data,
        mode: 'multiple',
      },
    }, {
      component: 'CheckboxGroup',
      value: ['A', 'B'],
      props: {
        options: data,
      },
    }, {
      component: 'ButtonCheckboxGroup',
      value: ['A', 'B'],
      props: {
        options: data,
      },
    }];
  }
  return [{
    component: 'ASelect',
    value: 'A',
    props: {
      options: data,
    },
  }, {
    component: 'ARadioGroup',
    value: 'A',
    props: {
      options: data,
    },
  }, {
    component: 'ButtonRadioGroup',
    value: 'A',
    props: {
      options: data,
    },
  }];
});

</script>
<script>
export default {
  inheritAttrs: false,
};
</script>
<template>
  <div class="comp-selector">
    <ARadioGroup class="radio-group" v-bind="$attrs">
      <ARadio v-for="item in options"
        :key="item.value"
        :value="item.value"
        class="radio-item"
      >
        {{item.label}}
      </ARadio>
    </ARadioGroup>
    <div>
      <component v-for="item in comps"
        class="item-comp"
        :key="item.component"
        :is="item.component"
        :value="item.value"
        disabled
        v-bind="item.props"
      />
    </div>
  </div>
</template>
<style scoped>
.comp-selector {
  display: flex;

  .radio-group {
    margin-top: 7px;
  }
  .radio-item {
    display: flex;
    margin-bottom: 20px;
  }

  .item-comp {
    margin-bottom: 15px;
  }
}
</style>
