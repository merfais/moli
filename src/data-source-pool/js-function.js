import runInNewContext from '@/uses/vm';
import Base from './base';

export default class JsFunction extends Base {
  constructor(info) {
    super(info);

    this.jsFn = info.jsFn;
  }

  calculate() {
    if (!this.jsFn) {
      this.innerValue = [];
    }
  }
  /**
   * 重载父类方法
   */
  async runJs() {
    this.innerValue = await runInNewContext(this.jsFn, this.jsFnCtx);
  }

  getAddonConfig() {
    return {
      jsFn: this.jsFn,
    };
  }
}

