import {
  get,
  map,
} from 'lodash-es';
import {
  shallowRef,
} from 'vue';
import {
  DATETIME_FORMAT_NAME,
} from '@/constants';
import {
  EDITOR_MENU,
} from '../constants';
import {
  getPlaceholderFormItems,
  getDisabledFormItems,
  getSimpleCompFormItems,
} from '../interact-common/use-common';

function getBasic(editor, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

  const items = shallowRef({
    formKey: { value: EDITOR_MENU.BASIC, class: 'd-none' },
    value: {
      label: '默认值',
      value: viewConf.value,
      component: 'RDatetimePicker',
      onUpdate,
    },
    valueFormat: {
      label: '值格式',
      value: viewConf.valueFormat,
      component: 'RSelect',
      compProps: {
        options: map(DATETIME_FORMAT_NAME, (label, value) => ({ label, value })),
      },
      onUpdate,
    },
  });

  return items;
}

function getAdvanced(editor, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

  const items = shallowRef({
    formKey: { value: EDITOR_MENU.ADVANCED, class: 'd-none' },
    name: {
      label: '组件名',
      value: viewConf.name,
      component: 'AInput',
      onUpdate,
    },
    ...getPlaceholderFormItems(editor, onUpdate),
    ...getDisabledFormItems(editor, onUpdate),
  });

  return items;
}

export default function getDatetimeFormItems(editor) {
  return getSimpleCompFormItems({
    editor,
    getBasic,
    getAdvanced,
  });
}

