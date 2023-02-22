import {
  get,
  set,
} from 'lodash-es';
import {
  reactive,
  markRaw,
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

  const formItems = {
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
  };

  return formItems;
}

function getStyle(editor, onUpdate) {
  const formItems = {
    formKey: { value: EDITOR_MENU.STYLE, class: 'd-none' },
    selectArea: {
      slot: 'divider',
      compInnerText: '选择器样式',
    },
    ...getViewStyleFormItems(editor, onUpdate),
  };

  return formItems;
}

export default function getEditorConf(editor) {
  const tabs = reactive({
    [EDITOR_MENU.BASIC]: {},
    [EDITOR_MENU.LABEL]: {},
    [EDITOR_MENU.DS]: {},
    [EDITOR_MENU.LAYOUT]: {},
    [EDITOR_MENU.STYLE]: {},
  });

  function onUpdate(key) {
    return (options = {}) => {
      let { path } = options;
      path = Array.isArray(path)
        ? [key, ...path]
        : `${key}.${path}`;
      set(editor, path, options.payload);
    };
  }

  function genBasicFormItems() {
    tabs[EDITOR_MENU.BASIC] = markRaw(getBasic(editor, onUpdate('viewConf')));
  }

  function genLabelFormItems() {
    tabs[EDITOR_MENU.LABEL] = markRaw(getLabel(editor, onUpdate('viewConf')));
  }

  function genDataSourceFormItems() {
    const dataSource = get(editor, 'dataSource.exportDS1') || {};
    tabs[EDITOR_MENU.DS] = markRaw(getDataSource(
      dataSource,
      onUpdate('dataSource.exportDS1'),
    ));
  }

  function genLayoutFormItems() {
    tabs[EDITOR_MENU.LAYOUT] = markRaw(getLayout(editor, onUpdate('pcLayout')));
  }

  function genStyleFormItems() {
    tabs[EDITOR_MENU.STYLE] = markRaw(getStyle(editor, onUpdate('viewConf.style')));
  }

  return {
    tabs,
    genBasicFormItems,
    genLabelFormItems,
    genDataSourceFormItems,
    genLayoutFormItems,
    genStyleFormItems,
  };
}

