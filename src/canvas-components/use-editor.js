import {
  watch,
  shallowRef,
} from 'vue';
import {
  map,
} from 'lodash-es';
import {
  useRules,
  required,
} from '@/uses/validate';
import DisabledFormItem from '@/canvas-components/common/disabled-form-item';
import {
  VALUE_TYPE_NANE,
  EDITOR_MENU,
} from './constants';

export function getLabel(options = {}) {
  const formItems = shallowRef(getLabelFormItems(options));

  watch(() => options.editor.viewConf?.withLabel, () => {
    formItems.value = getLabelFormItems(options);
  });

  return formItems;
}

export function getLabelFormItems(options = {}) {
  const { viewConf, onUpdate } = options;

  const items = {
    formKey: { value: EDITOR_MENU.LABEL, class: 'd-none' },
    withLabel: {
      label: '是否显示label',
      value: viewConf.withLabel,
      component: 'BoolSelector',
      onUpdate,
    },
  };
  if (viewConf.withLabel) {
    items.label = {
      label: 'label的值',
      value: viewConf.label,
      component: 'AInput',
      rules: useRules(required),
      onUpdate,
    };
    items.labelPos = {
      label: 'label位置',
      value: viewConf.labelPos,
      component: 'ButtonRadioGroup',
      compProps: {
        options: [
          { label: '上面', value: 'top' },
          { label: '左侧', value: 'left' },
        ],
      },
      onUpdate,
    };
  }

  return items;
}

export function getValueTypeFormItems(options = {}) {
  const { viewConf, onUpdate } = options;

  const items = {
    valueType: {
      label: '值类型',
      value: viewConf.valueType,
      component: 'ButtonRadioGroup',
      compProps: {
        options: map(VALUE_TYPE_NANE, (label, value) => ({ label, value })),
      },
      onUpdate,
    },
  };

  return items;
}

export function getDisabledFormItems(options = {}) {
  const { viewConf, onUpdate } = options;

  const items = {
    disabled: {
      label: '是否禁用',
      value: viewConf.disabled,
      component: DisabledFormItem,
      rules: useRules(validateDisabledValue),
      onUpdate,
    },
  };

  return items;
}

function validateDisabledValue(value) {
  if (value === false) {
    return;
  }
  if (!value) {
    return '请控制禁用状态的变量';
  }
}

export function getPlaceholderFormItems(options = {}) {
  const { viewConf, onUpdate } = options;

  const items = {
    placeholder: {
      label: 'placeholder的值',
      value: viewConf.placeholder,
      component: 'AInput',
      onUpdate,
    },
  };

  return items;
}

