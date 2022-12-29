import {
  get,
  set,
} from 'lodash-es';
import {
  watch,
} from 'vue';
import useCompEditorStore from '@/pages/canvas-editor/canvas-section/use-store';

export function initConfForm(options = {}) {
  const { formItems } = options;
  const editor = useCompEditorStore();

  watch(() => editor.visible, () => {
    if (editor.visible) {
      formItems.value = genFormItems();
    }
  }, { immediate: true });
}

function genFormItems() {
  const editor = useCompEditorStore();
  const viewConf = get(editor, 'viewConf', {});

  function onUpdate(options = {}) {
    const { path, payload } = options;

    set(viewConf, path, payload);
  }

  const items = {
    value: {
      label: '默认值',
      value: viewConf.vlaue,
      component: 'AInput',
      onUpdate,
    },
  };

  return items;
}


