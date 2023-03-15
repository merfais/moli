import {
  map,
  set,
} from 'lodash-es';
import {
  markRaw,
} from 'vue';
import {
  useRules,
  required,
} from '@/uses/validate';
import {
  MANUAL_DATA_SOURCE_TYPE_NAME,
} from '@/data-source-pool';
import {
  useDataSourceEditorStore,
} from '../use-store';

export function genFormItems() {
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

  dsEditorStore.formItems = markRaw(items);
}
