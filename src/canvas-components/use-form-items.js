import {
  watch,
  shallowRef,
} from 'vue';
import {
  map,
  set,
} from 'lodash-es';
import {
  useRules,
  required,
  isNormalChar,
} from '@/uses/validate';
import DisabledFormItem from '@/canvas-components/common/disabled-form-item';
import {
  VALUE_TYPE_NANE,
  EDITOR_MENU,
} from './constants';

export function getLabel(options = {}) {
  const items = shallowRef(getLabelFormItems(options));

  watch(() => options.editor.viewConf?.withLabel, () => {
    items.value = getLabelFormItems(options);
  });

  return items;
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
    return '请选择禁用状态的数据源';
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

export function getDataSource(options = {}) {
  const { dataSource } = options;

  function onUpdate(options = {}) {
    const { path, payload } = options;
    set(dataSource, path, payload);
  }

  const items = {
    formKey: { value: EDITOR_MENU.DS, class: 'd-none' },
    id: {
      label: '数据源ID',
      value: dataSource.id,
      component: 'AInput',
      rules: useRules([required, isNormalChar]),
      onUpdate,
    },
    name: {
      label: '数据源名字',
      value: dataSource.name,
      component: 'AInput',
      rules: useRules(required),
      onUpdate,
    },
  };

  return items;
}

