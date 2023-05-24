import {
  map,
} from 'lodash-es';
import Base from './base';
import { convertValueType } from './use-helper';
import { ASYNC_STATUS } from './constants';

export default class InputLikeView extends Base {
  constructor(info) {
    super(info);
    this.valueType = info.valueType;
  }

  /**
   * 重载父类方法
   */
  async calculate() {
    try {
      const { tmpData, valueType } = this;
      this.innerStatus = ASYNC_STATUS.FULFILLED;
      this.innerValue = Array.isArray(tmpData)
        ? map(tmpData, item => convertValueType(item, valueType))
        : convertValueType(tmpData, valueType);
    } catch (error) {
      this.innerStatus = ASYNC_STATUS.REJECTED;
      this.setError(error);
    }
  }

  /**
   * 重载父类方法
   */
  getAddonConfig() {
    return {
      valueType: this.valueType,
    };
  }
}
