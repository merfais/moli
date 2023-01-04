import {
  watch,
} from 'vue';
import {
  map,
} from 'lodash-es';
import {
  useRules,
  required,
} from '@/uses/validate';
import useCompEditorStore from '@/pages/canvas-editor/canvas-section/use-store';
import {
  VALUE_TYPE_NANE,
} from './constants';

export function initConfForm(options = {}) {
  const { formItems, genFormItems } = options;
  const editor = useCompEditorStore();

  watch(() => editor.visible, () => {
    if (editor.visible) {
      formItems.value = genFormItems({ editor });
    }
  }, { immediate: true });

  watch(() => editor.viewConf?.withLabel, () => {
    formItems.value = genFormItems({ editor });
  });
}

export function getTitleFormItems(options = {}) {
  const { viewConf, onUpdate } = options;

  const items = {
    labelDivider: {
      slot: 'divider',
      compInnerText: 'label配置',
    },
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

