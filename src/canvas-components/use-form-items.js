import {
  watch,
  shallowRef,
} from 'vue';
import {
  map,
  get,
} from 'lodash-es';
import {
  useRules,
  required,
  isNormalChar,
} from '@/uses/validate';
import { DisabledFormItem } from './common';
import {
  VALUE_TYPE_NANE,
  EDITOR_MENU,
} from './constants';

export function getLabel(editor = {}, onUpdate) {
  const items = shallowRef(getLabelFormItems(editor, onUpdate));

  watch(() => editor.viewConf?.withLabel, () => {
    items.value = getLabelFormItems(editor, onUpdate);
  });

  return items;
}

function getLabelFormItems(editor = {}, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

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

export function getValueTypeFormItems(editor = {}, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

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

export function getDisabledFormItems(editor = {}, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

  const items = {
    disabledDepDS: {
      label: '是否禁用',
      value: viewConf.depDSs?.disabled || '',
      path: 'depDSs.disabled',
      component: DisabledFormItem,
      compProps: {
        exportDSs: get(viewConf, 'exportDSs'),
      },
      rules: useRules(validateDisabledValue),
      onUpdate,
    },
  };

  return items;
}

function validateDisabledValue(value) {
  if (value === '') {
    return;
  }
  if (value === undefined) {
    return '请选择禁用状态的数据源';
  }
}

export function getPlaceholderFormItems(editor = {}, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

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

export function getDataSource(dataSource = {}, onUpdate) {
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

export function getLayout(editor = {}, onUpdate) {
  const pcLayout = get(editor, 'pcLayout') || {};

  const items = {
    formKey: { value: EDITOR_MENU.LAYOUT, class: 'd-none' },
    x: {
      label: '组件位置 x',
      value: pcLayout.x,
      component: 'AInputNumber',
      rules: useRules(required),
      onUpdate,
    },
    y: {
      label: '组件位置 y',
      value: pcLayout.y,
      component: 'AInputNumber',
      rules: useRules(required),
      onUpdate,
    },
    w: {
      label: '组件宽度',
      value: pcLayout.w,
      component: 'AInputNumber',
      rules: useRules(required),
      onUpdate,
    },
    h: {
      label: '组件高度',
      value: pcLayout.h,
      component: 'AInputNumber',
      rules: useRules(required),
      onUpdate,
    },
  };

  return items;
}

export function getViewStyleFormItems(editor = {}, onUpdate) {
  const style = get(editor, 'viewConf.style') || {};

  const items = {
    width: {
      label: '宽度',
      value: style.width,
      component: 'AInput',
      onUpdate,
    },
    height: {
      label: '高度',
      value: style.height,
      component: 'AInput',
      onUpdate,
    },
    marginTop: {
      label: '上外边距',
      value: style.marginTop,
      component: 'AInput',
      onUpdate,
    },
    marginRight: {
      label: '右外边距',
      value: style.marginRight,
      component: 'AInput',
      onUpdate,
    },
    marginBottom: {
      label: '下外边距',
      value: style.marginBottom,
      component: 'AInput',
      onUpdate,
    },
    marginLeft: {
      label: '左外边距',
      value: style.marginLeft,
      component: 'AInput',
      onUpdate,
    },
  };

  return items;
}

