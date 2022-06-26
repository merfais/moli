import { forEach } from 'lodash-es';
import { defineAsyncComponent } from 'vue';
import * as icons from './icons';
import RForm from './form';
import RButton from './button';
import RDrawer from './drawer';
import RModal from './modal';
import RTable from './table';
import RTooltip from './tooltip';
import ButtonCheckbox from './button-checkbox';
import ButtonCheckboxGroup from './button-checkbox-group';
import ButtonRadioGroup from './button-radio-group';
import RadioGroup from './radio-group';
import CheckboxGroup from './checkbox-group';
import ToolBox from './tool-box';
import FoldButton from './fold-button';
import DropdownSelect from './dropdown-select';

export default function install(app) {
  const comps = {
    RForm,
    RTable,
    RButton,
    RModal,
    RDrawer,
    ButtonCheckbox,
    ButtonCheckboxGroup,
    ButtonRadioGroup,
    CheckboxGroup,
    RadioGroup,
    JsonViewer: () => import(/* webpackChunkName: "json-viewer-comp" */'./json-viewer'),
    ToolBox,
    RChart: () => import(/* webpackChunkName: "chart-comp" */'./chart'),
    FoldButton,
    DropdownSelect,
    RTooltip,
  };

  forEach(comps, (comp, name) => {
    if (typeof comp === 'function') {
      app.component(name, defineAsyncComponent(comp));
    } else {
      app.component(name, comp);
    }
  });

  forEach(icons, (comp, name) => {
    app.component(name, comp);
  });
}
