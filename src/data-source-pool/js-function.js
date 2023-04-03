import {
  xor,
} from 'lodash-es';
import runInNewContext from '@/uses/vm';
import Base from './base';
import { ASYNC_STATUS } from './constants';

export default class JsFunction extends Base {
  jsFn = '';

  /**
   * 重载父类方法
   */
  async genJsDeps() {
    const dataSource = this.getDSProxy();
    try {
      await runInNewContext(this.jsFn, { dataSource });
    } catch (e) {
      // 忽略错误
      // 如果发生错误，否则订阅全部
      this.jsDepSet = new Set('*');
    }
    this.jsDeps = [...this.jsDepSet];
  }

  /**
   * 重载父类方法
   */
  async invokeJs() {
    const { jsFn } = this;
    if (!jsFn) {
      this.innerValue = [];
      this.innerStatus = ASYNC_STATUS.FULFILLED;
      return;
    }
    const dataSource = this.getDSProxy();
    try {
      this.innerValue = await runInNewContext(jsFn, { dataSource });
      this.innerStatus = ASYNC_STATUS.FULFILLED;
    } catch (e) {
      this.innerStatus = ASYNC_STATUS.REJECTED;
      this.setError(e);
      // 如果发生错误，否则订阅全部
      this.jsDepSet = new Set('*');
    }
    const newJsDeps = [...this.jsDepSet];

    if (xor(newJsDeps, this.jsDeps)?.length) {
      // TODO: 重新订阅
      // this.msgCenter.unSubscribe(this.asyncDeps, this.)
    }
    this.jsDeps = newJsDeps;
  }
}

