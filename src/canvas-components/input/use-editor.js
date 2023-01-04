import {
  get,
  set,
} from 'lodash-es';
import {
  getTitleFormItems,
  getValueTypeFormItems,
  getPlaceholderFormItems,
} from '../use-common';

export function genFormItems(options = {}) {
  const { editor } = options;
  const viewConf = get(editor, 'viewConf', {});

  function onUpdate(options = {}) {
    const { path, payload } = options;

    set(viewConf, path, payload);
  }

  const items = {
    baseDivider: {
      slot: 'divider',
      compInnerText: '基础配置',
    },
    value: {
      label: '默认值',
      value: viewConf.value,
      component: 'AInput',
      onUpdate,
    },
    ...getValueTypeFormItems({ viewConf, onUpdate }),
    ...getPlaceholderFormItems({ viewConf, onUpdate }),
    ...getTitleFormItems({ viewConf, onUpdate }),
  };

  return items;
}

