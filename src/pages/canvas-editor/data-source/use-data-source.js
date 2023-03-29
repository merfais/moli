import {
  map,
  set,
} from 'lodash-es';
import {
  markRaw,
  watch,
} from 'vue';
import { message } from 'ant-design-vue';
import {
  useRules,
  required,
} from '@/uses/validate';
import {
  MANUAL_DATA_SOURCE_TYPE_NAME,
  MANUAL_DATA_SOURCE_TYPE,
} from '@/data-source-pool';
import {
  registerEditorDS,
} from '@/stores/ds-pool';
import {
  PLACEHOLDER,
} from '@/constants';
import {
  useDataSourceEditorStore,
} from '../use-store';
import JsFnEditor from './js-fn-editor';

export function onClickAdd() {
  const dsEditorStore = useDataSourceEditorStore();
  dsEditorStore.$reset();
  dsEditorStore.visible = true;
  setFormItems();
}

export async function onClickSave() {
  const dsEditorStore = useDataSourceEditorStore();
  try {
    if (dsEditorStore?.form?.validate) {
      await dsEditorStore.form.validate();
    }
  } catch (e) {
    message.warn('校验未通过，请检查~');
    console.warn('表单校验失败', e);
    return;
  }

  dsEditorStore.visible = false;
  registerEditorDS(dsEditorStore.record);
}

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
      value: record.jsFn || PLACEHOLDER.JS_FN,
      component: JsFnEditor,
      compProps: {
        placeholder: PLACEHOLDER.JS_FN,
      },
      onUpdate,
    };
  } else if (record.type === MANUAL_DATA_SOURCE_TYPE.STATIC_DATA) {
    items.value = {
      isNotFormItem: true,
      value: record.value || PLACEHOLDER.STATIC_DATA,
      component: 'Monaco',
      compProps: {
        language: 'javascript',
        style: { height: '500px' },
        placeholder: PLACEHOLDER.STATIC_DATA,
      },
      onUpdate,
    };
  }

  return markRaw(items);
}
