import { forEach } from 'lodash-es';
import { defineAsyncComponent } from 'vue';
import * as icons from './icons';
import RForm from './form';
import FormItems from './form/form-items';
import FormItem from './form/form-item';
import Form from './form/form';
import REmpty from './empty';
import RButton from './button';
import RDrawer from './drawer';
import RModal from './modal';
import RTable from './table/r-table';
import VTable from './table/v-table';
import RSelect from './select';
import MultiSelect from './multi-select';
import RInput from './input';
import RTextarea from './textarea';
import RAutoComplete from './auto-complete';
import DatetimePicker from './datetime-picker';
import LabelValueInfo from './label-value-info';
import LabelValueInfos from './label-value-infos';
import ConfirmButton from './confirm-button';
import ButtonCheckbox from './button-checkbox';
import ButtonCheckboxGroup from './button-checkbox-group';
import ButtonRadioGroup from './button-radio-group';
import RadioGroup from './radio-group';
import CheckboxGroup from './checkbox-group';
import CompSelector from './comp-selector';
import CompareDate from './compare-date';
import CompareNumber from './compare-number';
import CompareSelect from './compare-select';
import BoolSelector from './bool-selector';
import ImgLink from './img-link';
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
import Loading from './loading';
import KeyValueInput from './key-value-input';
import RangePicker from './range-picker';
import ColorPicker from './color-picker';
import LogDiff from './log-diff';
import Repeat from './repeat';

export default function install(app) {
  const comps = {
    RForm,
    RTable,
    VTable,
    RButton,
    RModal,
    RDrawer,
    REmpty,
    RSelect,
    MultiSelect,
    RInput,
    RTextarea,
    RAutoComplete,
    LabelValueInfo,
    LabelValueInfos,
    ConfirmButton,
    Form,
    FormItems,
    FormItem,
    ButtonCheckbox,
    ButtonCheckboxGroup,
    ButtonRadioGroup,
    CheckboxGroup,
    RadioGroup,
    CompSelector,
    CompareDate,
    CompareNumber,
    CompareSelect,
    BoolSelector,
    ImgLink,
    DatetimePicker,
    HelpLink,
    HelpTip,
    // eslint-disable-next-line max-len
    JsonViewer: () => import(/* webpackChunkName: "json-viewer-comp" */'./json-viewer'),
    // eslint-disable-next-line max-len
    LargeJsonViewer: () => import(/* webpackChunkName: "large-json-viewer-comp" */'./large-json-viewer'),
    DiffViewer: () => import(/* webpackChunkName: "monaco" */'./monaco/diff-viewer'),
    Monaco: () => import(/* webpackChunkName: "monaco" */'./monaco'),
    ToolBox,
    RChart: () => import(/* webpackChunkName: "chart-comp" */'./chart'),
    RangePicker,
    ColorPicker,
    FoldButton,
    FoldTag,
    DropDownSelect,
    DownloadButton,
    PhoneContainer,
    RTooltip,
    ErrorCover,
    LoadingCover,
    Loading,
    LogDiff,
    KeyValueInput,
    Repeat,
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
