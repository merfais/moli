import {
  get,
  set,
  map,
} from 'lodash-es';
import {
  shallowRef,
  watch,
} from 'vue';
import {
  useRules,
  required,
} from '@/uses/validate';
import {
  EDITOR_MENU,
  SELECT_COMP_TYPE,
  SELECT_COMP_TYPE_NAME,
} from '../constants';
import {
  SelectOptionsFormItem,
} from '../common';
import {
  getLabel,
  getDataSource,
  getLayout,
  getPlaceholderFormItems,
  getDisabledFormItems,
  getViewStyleFormItems,
} from '../use-form-items';
import InitValSelector from './init-val-selector';

function getBasic(editor, onUpdate) {
  const items = shallowRef(genBasicFormItems(editor, onUpdate));

  watch(() => editor.viewConf?.depDS, () => {
    // TODO: watch dataSource变化，取dataSource的值
    items.value = genBasicFormItems(editor, onUpdate);
  });

  watch(() => editor.viewConf.initVal, () => {
    items.value = genBasicFormItems(editor, onUpdate);
  });

  return items;
}

function genBasicFormItems(editor, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

  const items = {
    formKey: { value: EDITOR_MENU.BASIC, class: 'd-none' },
    name: {
      label: '组件名',
      value: viewConf.name,
      component: 'AInput',
      onUpdate,
    },
    compType: {
      label: '组件形态',
      value: viewConf.compType,
      component: 'ButtonRadioGroup',
      compProps: {
        options: map([
          SELECT_COMP_TYPE.SELECT,
          SELECT_COMP_TYPE.RADIO,
          SELECT_COMP_TYPE.BTN_RADIO,
        ], value => ({ value, label: SELECT_COMP_TYPE_NAME[value] })),
      },
    },
    optionsDS: {
      label: '单选选项来源',
      value: viewConf.optionsDS,
      component: SelectOptionsFormItem,
      compProps: {
        exportDSs: get(viewConf, 'exportDSs'),
      },
      rules: useRules(required),
      onUpdate,
    },
    labelField: {
      label: '选项文字取自',
      value: viewConf.labelField,
      component: 'RInput',
      compProps: {
        preText: '数据的',
        postText: '字段',
      },
      onUpdate,
    },
    valueField: {
      label: '选项值取自',
      value: viewConf.valueField,
      component: 'RInput',
      compProps: {
        preText: '数据的',
        postText: '字段',
      },
      onUpdate,
    },
    value: {
      label: '默认值',
      value: viewConf.value,
      component: InitValSelector,
      compProps: {
        initVal: viewConf.initVal,
        optionsDS: viewConf.optionsDS,
        onUpdateInitVal: (payload) => onUpdate({ path: 'initVal', payload }),
      },
      onUpdate,
    },
    ...getPlaceholderFormItems(editor, onUpdate),
    ...getDisabledFormItems(editor, onUpdate),
  };

  return items;
}

function getStyle(editor, onUpdate) {
  const formItems = shallowRef({
    formKey: { value: EDITOR_MENU.STYLE, class: 'd-none' },
    selectArea: {
      slot: 'divider',
      compInnerText: '选择器样式',
    },
    ...getViewStyleFormItems(editor, onUpdate),
  });

  return formItems;
}

export default function getSelectFormItems(editor) {
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

