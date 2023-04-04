import runInNewContext from '@/uses/vm';
import Base from './base';

export default class JsFunction extends Base {
  jsFn = '';

  /**
   * 重载父类方法
   */
  async runJs() {
    return runInNewContext(this.jsFn, this.jsFnCtx);
  }
}

