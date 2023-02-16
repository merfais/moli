import {
  get,
  set,
} from 'lodash-es';
import {
  shallowRef,
} from 'vue';
import {
  EDITOR_MENU,
} from '../constants';
import {
  getLabel,
  getDataSource,
  getLayout,
  getValueTypeFormItems,
  getPlaceholderFormItems,
  getDisabledFormItems,
  getViewStyleFormItems,
} from '../use-form-items';

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
    ...getValueTypeFormItems(editor, onUpdate),
    ...getPlaceholderFormItems(editor, onUpdate),
    ...getDisabledFormItems(editor, onUpdate),
  });

  return formItems;
}

function getStyle(editor, onUpdate) {
  const formItems = shallowRef({
    formKey: { value: EDITOR_MENU.STYLE, class: 'd-none' },
    inputArea: {
      slot: 'divider',
      compInnerText: '输入框样式',
    },
    ...getViewStyleFormItems(editor, onUpdate),
  });

  return formItems;
}

export default function getInputFormItems(editor) {
  function onUpdate(key) {
    return (options = {}) => {
      let { path } = options;
      path = Array.isArray(path)
        ? [key, ...path]
        : `${key}.${path}`;
      set(editor, path, options.payload);
    };
  }

  const dataSource = get(editor, 'dataSource.exportDS1') || {};

  return {
    [EDITOR_MENU.BASIC]: getBasic(editor, onUpdate('viewConf')),
    [EDITOR_MENU.LABEL]: getLabel(editor, onUpdate('viewConf')),
    [EDITOR_MENU.DS]: getDataSource(dataSource, onUpdate('dataSource.exportDS1')),
    [EDITOR_MENU.LAYOUT]: getLayout(editor, onUpdate('pcLayout')),
    [EDITOR_MENU.STYLE]: getStyle(editor, onUpdate('viewConf.style')),
  };
}

