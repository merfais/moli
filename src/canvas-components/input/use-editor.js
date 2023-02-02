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
  getValueTypeFormItems,
  getPlaceholderFormItems,
  getDisabledFormItems,
} from '../use-editor';

function getBasic(options = {}) {
  const { viewConf, onUpdate } = options;
  const formItems = shallowRef({
    formKey: { value: EDITOR_MENU.BASIC, class: 'd-none' },
    value: {
      label: '默认值',
      value: viewConf.value,
      component: 'AInput',
      onUpdate,
    },
    ...getValueTypeFormItems(options),
    ...getPlaceholderFormItems(options),
    ...getDisabledFormItems(options),
  });

  return formItems;
}

export default function getInputFormItems(editor) {
  const viewConf = get(editor, 'viewConf') || {};
  const dataSource = get(editor, 'dataSource.exportDS1') || {};

  function onUpdate(options = {}) {
    const { path, payload } = options;
    set(viewConf, path, payload);
  }

  return {
    [EDITOR_MENU.BASIC]: getBasic({ viewConf, onUpdate, editor }),
    [EDITOR_MENU.LABEL]: getLabel({ viewConf, onUpdate, editor }),
    [EDITOR_MENU.DS]: getDataSource({ dataSource, editor }),
    [EDITOR_MENU.LAYOUT]: {},
    [EDITOR_MENU.STYLE]: {},
  };
}

