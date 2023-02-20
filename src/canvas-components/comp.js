import { COMP_KEY } from './constants';
import Input from './input';
import Select from './select';

export const compMap = {
  [COMP_KEY.INPUT]: Input,
  [COMP_KEY.SELECT]: Select,
};
