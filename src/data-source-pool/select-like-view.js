import {
  get,
  map,
} from 'lodash-es';
import {
  INIT_VAL_TYPE,
  ASYNC_STATUS,
} from './constants';
import Base from './base';

export default class SelectLikeView extends Base {
  constructor(info) {
    super(info);
    this.initValType = info.initValType;
    this.labelField = info.labelField;
    this.valueField = info.valueField;
    this.firstN = info.firstN;
  }

  async genStaticDeps() {
    this.staticDeps = this.depDSs?.options ? [this.depDSs.options] : [];
  }

  async calculate() {
    const { tmpData, initValType, useTmpData } = this;
    if (initValType === INIT_VAL_TYPE.STATIC || useTmpData) {
      this.innerValue = tmpData;
    } else {
      this.innerValue = this.getInitValue();
    }
    this.innerStatus = ASYNC_STATUS.FULFILLED;
  }

  getInitValue() {
    const { depDSs, dsMap } = this;
    const optionsList = get(dsMap, [depDSs?.options, 'value']);
    if (!Array.isArray(optionsList)) {
      return;
    }
    const { initValType, valueField } = this;
    const valueList = map(optionsList, item => get(item, valueField));
    if (initValType === INIT_VAL_TYPE.FIRST) {
      return valueList[0];
    }
    if (initValType === INIT_VAL_TYPE.ALL) {
      return valueList;
    }
    if (initValType === INIT_VAL_TYPE.FIRST_N) {
      return valueList.slice(0, this.firstN);
    }
  }

  /**
   * 重载父类方法
   */
  getAddonConfig() {
    return {
      initValType: this.initValType,
      labelField: this.labelField,
      valueField: this.valueField,
      firstN: this.firstN,
    };
  }
}

