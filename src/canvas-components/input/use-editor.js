import {
  get,
  map,
} from 'lodash-es';
import {
  shallowRef,
} from 'vue';
import {
  EDITOR_MENU,
  VALUE_TYPE_NANE,
} from '../constants';
import {
  getPlaceholderFormItems,
  getDisabledFormItems,
  getSimpleCompFormItems,
} from '../interact-common/use-common';

function getBasic(editor, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

  const formItems = shallowRef({
    formKey: { value: EDITOR_MENU.BASIC, class: 'd-none' },
    name: {
      label: '组件名',
      value: viewConf.name,
      component: 'AInput',
      onUpdate,
    },
    value: {
      label: '默认值',
      value: viewConf.value,
      component: 'AInput',
      onUpdate,
    },
    valueType: {
      label: '值类型',
      value: viewConf.valueType,
      component: 'ButtonRadioGroup',
      compProps: {
        options: map(VALUE_TYPE_NANE, (label, value) => ({ label, value })),
      },
      onUpdate,
    },
    ...getPlaceholderFormItems(editor, onUpdate),
    ...getDisabledFormItems(editor, onUpdate),
  });

  return formItems;
}

export default function getInputFormItems(editor) {
  return getSimpleCompFormItems({
    editor,
    getBasic,
  });
}

