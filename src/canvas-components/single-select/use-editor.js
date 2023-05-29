import {
  get,
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
  COMP_KEY,
  SELECT_COMP_TYPE,
  SELECT_COMP_TYPE_NAME,
} from '../constants';
import SelectOptions from '../interact-common/select-options';
import DsFieldSeletor from '../interact-common/ds-field-selector';
import SelectInitValType from '../interact-common/select-init-val-type';
import {
  getPlaceholderFormItems,
  getDisabledFormItems,
  getSimpleCompFormItems,
} from '../interact-common/use-common';

function getBasic(editor, onUpdate) {
  const items = shallowRef(genBasicFormItems(editor, onUpdate));

  watch(() => [
    editor.viewConf.depDSs?.options,
    editor.viewConf.initValType,
    editor.viewConf.firstN,
    editor.viewConf.labelField,
    editor.viewConf.valueField,
  ], () => {
    items.value = genBasicFormItems(editor, onUpdate);
  }, { deep: true });

  return items;
}

const compTypeOptsMap = {
  [COMP_KEY.SINGLE_SELECT]: map([
    SELECT_COMP_TYPE.SELECT,
    SELECT_COMP_TYPE.RADIO,
    SELECT_COMP_TYPE.BTN_RADIO,
  ], value => ({ value, label: SELECT_COMP_TYPE_NAME[value] })),
  [COMP_KEY.MULTI_SELECT]: map([
    SELECT_COMP_TYPE.SELECT,
    SELECT_COMP_TYPE.CHECKBOX,
    SELECT_COMP_TYPE.BTN_CHECKBOX,
  ], value => ({ value, label: SELECT_COMP_TYPE_NAME[value] })),
};

function genBasicFormItems(editor, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

  const items = {
    formKey: { value: EDITOR_MENU.BASIC, class: 'd-none' },
    compType: {
      label: '组件形态',
      value: viewConf.compType,
      component: 'ButtonRadioGroup',
      compProps: {
        options: compTypeOptsMap[editor.compKey],
      },
      onUpdate,
    },
    optionsDepDS: {
      label: '选项列表来源',
      value: viewConf.depDSs?.options,
      path: 'depDSs.options',
      component: SelectOptions,
      compProps: {
        exportDSs: viewConf.exportDSs,
      },
      rules: useRules(required),
      onUpdate,
    },
    value: {
      label: '默认值',
      value: viewConf.value,
      component: SelectInitValType,
      compProps: {
        compKey: viewConf.compKey,
        initValType: viewConf.initValType,
        firstN: viewConf.firstN,
        depDSs: viewConf.depDSs,
        labelField: viewConf.labelField,
        valueField: viewConf.valueField,
        onUpdateInitValType: (payload) => onUpdate({ path: 'initValType', payload }),
        onUpdateFirstN: (payload) => onUpdate({ path: 'firstN', payload }),
      },
      onUpdate,
    },
  };

  return items;
}

function getAdvanced(editor, onUpdate) {
  const items = shallowRef(genAdvancedFormItems(editor, onUpdate));
  return items;
}

function genAdvancedFormItems(editor, onUpdate) {
  const viewConf = get(editor, 'viewConf') || {};

  const items = {
    formKey: { value: EDITOR_MENU.ADVANCED, class: 'd-none' },
    name: {
      label: '组件名',
      value: viewConf.name,
      component: 'AInput',
      onUpdate,
    },
    labelField: {
      label: '选项文字取自',
      value: viewConf.labelField,
      component: DsFieldSeletor,
      compProps: {
        depDSs: viewConf.depDSs,
      },
      onUpdate,
    },
    valueField: {
      label: '选项值取自',
      value: viewConf.valueField,
      component: DsFieldSeletor,
      compProps: {
        depDSs: viewConf.depDSs,
      },
      onUpdate,
    },
    ...getPlaceholderFormItems(editor, onUpdate),
    ...getDisabledFormItems(editor, onUpdate),
  };

  return items;
}

export default function getSelectFormItems(editor) {
  return getSimpleCompFormItems({
    editor,
    getBasic,
    getAdvanced,
  });
}

