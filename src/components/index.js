import { forEach } from 'lodash-es';
import { defineAsyncComponent } from 'vue';
import * as icons from './icons';
import RForm from './form';
import FormItems from './form/form-items';
import Form from './form/form';
import REmpty from './empty';
import RButton from './button';
import RDrawer from './drawer';
import RModal from './modal';
import RTable from './table';
import ButtonCheckbox from './button-checkbox';
import ButtonCheckboxGroup from './button-checkbox-group';
import ButtonRadioGroup from './button-radio-group';
import RadioGroup from './radio-group';
import CheckboxGroup from './checkbox-group';
import CompSelector from './comp-selector';
import CompareDate from './compare-date';
import CompareNumber from './compare-number';
import CompareSelect from './compare-select';
import HelpLink from './help-link';
import ToolBox from './tool-box';
import FoldButton from './fold-button';
import FoldTag from './fold-tag';
import DropDownSelect from './drop-down-select';
import RTooltip from './tooltip';
import HelpTip from './help-tip';
import DownloadButton from './download-button';
import PhoneContainer from './phone-container';
import ErrorCover from './error-cover';
import LoadingCover from './loading-cover';

export default function install(app) {
  const comps = {
    RForm,
    RTable,
    RButton,
    RModal,
    RDrawer,
    REmpty,
    Form,
    FormItems,
    ButtonCheckbox,
    ButtonCheckboxGroup,
    ButtonRadioGroup,
    CheckboxGroup,
    RadioGroup,
    CompSelector,
    CompareDate,
    CompareNumber,
    CompareSelect,
    HelpLink,
    HelpTip,
    // eslint-disable-next-line max-len
    JsonViewer: () => import(/* webpackChunkName: "json-viewer-comp" */'./json-viewer'),
    // eslint-disable-next-line max-len
    LargeJsonViewer: () => import(/* webpackChunkName: "json-viewer-comp" */'./large-json-viewer'),
    DiffViewer: () => import(/* webpackChunkName: "diff-viewer" */'./diff-viewer'),
    ToolBox,
    RChart: () => import(/* webpackChunkName: "chart-comp" */'./chart'),
    RangePicker: () => import(/* webpackChunkName: "element-plus-ui" */'./range-picker'),
    FoldButton,
    FoldTag,
    DropDownSelect,
    DownloadButton,
    PhoneContainer,
    RTooltip,
    ErrorCover,
    LoadingCover,
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
