import runInNewContext from '@/uses/vm';
import Base from './base';

export default class JsFunction extends Base {
  /**
   * 重载父类方法
   */
  async runJs() {
    if (this.jsFn) {
      return runInNewContext(this.jsFn, this.jsFnCtx);
    }
    return [];
  }
}

