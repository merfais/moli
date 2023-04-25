import {
  map,
  set,
  cloneDeep,
  forEach,
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
  updateEditorDS,
  getEditorDSIdList,
} from '@/stores/ds-pool';
import {
  PLACEHOLDER,
} from '@/constants';
import {
  useDataSourceEditorStore,
} from '../use-store';
import JsFnEditor from './js-fn-editor';

export function onClickAdd(uid) {
  const dsEditorStore = useDataSourceEditorStore();
  dsEditorStore.$reset();
  dsEditorStore.visible = true;
  if (typeof uid === 'string') {
    dsEditorStore.uid = uid;
  }
  setFormItems();
}

export function onClickClone(options = {}) {
  const dsEditorStore = useDataSourceEditorStore();
  dsEditorStore.$reset();
  dsEditorStore.visible = true;
  dsEditorStore.record = cloneDeep(options.record.metaItem) || {};
  dsEditorStore.record.oldId = dsEditorStore.record.id;
  setFormItems();
}

export function onClickModify(options = {}) {
  const dsEditorStore = useDataSourceEditorStore();
  dsEditorStore.$reset();
  dsEditorStore.visible = true;
  dsEditorStore.title = '修改数据源';
  dsEditorStore.record = cloneDeep(options.record.metaItem) || {};
  dsEditorStore.record.oldId = dsEditorStore.record.id;
  dsEditorStore.editType = 'update';
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

  if (dsEditorStore.editType === 'create') {
    registerEditorDS(dsEditorStore.record);
  } else {
    updateEditorDS(dsEditorStore.record);
  }
  dsEditorStore.visible = false;
}

function setFormItems() {
  const dsEditorStore = useDataSourceEditorStore();

  dsEditorStore.formItems = genFormItems();

  const { record } = dsEditorStore;
  watch(() => record.type, () => {
    forEach(record, (v, k) => {
      if (k !== 'id' && k !== 'name' && k !== 'type') {
        record[k] = undefined;
      }
    });
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
    id: {
      label: 'ID',
      value: record.id,
      component: 'RInput',
      rules: useRules(required, validateId),
      onUpdate,
    },
    name: {
      label: '名字',
      value: record.name,
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

function validateId(value) {
  const dsEditorStore = useDataSourceEditorStore();
  const { editType, record } = dsEditorStore;
  if (editType === 'update'
    && record?.id === record?.oldId
  ) {
    return;
  }
  const list = getEditorDSIdList();
  if (list.indexOf(value) !== -1) {
    return `已经存在 id = ${value} 的数据源，不可重复`;
  }
}
