import { COMP_KEY } from './constants';
import Input from './input/conf-editor';

export default async function getConfEditorMap(compKey) {
  const editorMap = {
    [COMP_KEY.INPUT]: Input,
  };
  return editorMap[compKey] || 'div';
}
