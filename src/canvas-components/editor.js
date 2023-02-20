import { COMP_KEY } from './constants';
import getInputFormItems from './input/use-editor';
import getSelectFormItems from './select/use-editor';

export const editorConfMap = {
  [COMP_KEY.INPUT]: getInputFormItems,
  [COMP_KEY.SELECT]: getSelectFormItems,
};

