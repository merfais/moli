import { COMP_KEY } from './constants';
import getInputFormItems from './input/use-editor';
import getSingleSelectFormItems from './single-select/use-editor';
import getMultiSelectFormItems from './multi-select/use-editor';

export const editorConfMap = {
  [COMP_KEY.INPUT]: getInputFormItems,
  [COMP_KEY.SINGLE_SELECT]: getSingleSelectFormItems,
  [COMP_KEY.MULTI_SELECT]: getMultiSelectFormItems,
};

