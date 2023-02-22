import { COMP_KEY } from './constants';
import Input from './input';
import SingleSelect from './single-select';
import MultiSelect from './multi-select';

export const compMap = {
  [COMP_KEY.INPUT]: Input,
  [COMP_KEY.SINGLE_SELECT]: SingleSelect,
  [COMP_KEY.MULTI_SELECT]: MultiSelect,
};
