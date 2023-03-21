import {
  map,
  set,
} from 'lodash-es';
import {
  markRaw,
  watch,
} from 'vue';
import {
  useRules,
  required,
} from '@/uses/validate';
import {
  MANUAL_DATA_SOURCE_TYPE_NAME,
  MANUAL_DATA_SOURCE_TYPE,
} from '@/data-source-pool';
import {
  useDataSourceEditorStore,
} from '../use-store';
import JsFnEditor from './js-fn-editor';

export function setFormItems() {
  const dsEditorStore = useDataSourceEditorStore();

  dsEditorStore.formItems = genFormItems();

  const { record } = dsEditorStore;
  watch(() => record.type, () => {
    dsEditorStore.formItems = genFormItems();
  });
}

function genFormItems() {
  const dsEditorStore = useDataSourceEditorStore();

  const { record } = dsEditorStore;

  function onUpdate(options = {}) {
    const { path, payload } = options;
    set(dsEditorStore.record, path, payload);
  }

  const items = {
    name: {
      label: '名字',
      value: record.name,
      component: 'RInput',
      rules: useRules(required),
      onUpdate,
    },
    id: {
      label: 'ID',
      value: record.id,
      component: 'RInput',
      rules: useRules(required),
      onUpdate,
    },
    type: {
      label: '类型',
      value: record.type,
      component: 'ButtonRadioGroup',
      compProps: {
        options: map(MANUAL_DATA_SOURCE_TYPE_NAME, (label, value) => ({
          label,
          value,
        })),
      },
      rules: useRules(required),
      onUpdate,
    },
  };

  if (record.type === MANUAL_DATA_SOURCE_TYPE.JS_FUNCTION) {
    items.jsFn = {
      isNotFormItem: true,
      component: JsFnEditor,
      onUpdate,
    };
  }

  return markRaw(items);
}
