import {
  get,
  isEqual,
  cloneDeep,
} from 'lodash-es';
import runInNewContext from '@/uses/vm';
import Base from './base';
import { ASYNC_STATUS } from './constants';

export default class JsFunction extends Base {
  jsFn = '';
  depSet = new Set();

  /**
   * 重载父类方法
   */
  async genAsyncDeps() {
    const dataSource = this.getDSProxy();
    try {
      await runInNewContext(this.jsFn, { dataSource });
      this.asyncDeps = [...this.depSet];
    } catch (e) {
      // 忽略错误
      // 如果已经收集一部分依赖则订阅这一部分，否则订阅全部
      if (this.depSet.size) {
        this.asyncDeps = [...this.depSet];
      } else {
        this.asyncDeps = ['*'];
      }
    }
  }

  /**
   * 重载父类方法
   */
  async request() {
    this.innerStatus = ASYNC_STATUS.PENDING;
    this.setError();
    const { jsFn } = this;
    if (!jsFn) {
      this.tmpData = [];
      this.calculate();
      return;
    }
    let newAsyncDeps;
    const dataSource = this.getDSProxy();
    try {
      this.tmpData = await runInNewContext(jsFn, { dataSource });
      newAsyncDeps = [...this.depSet];
    } catch (e) {
      this.innerStatus = ASYNC_STATUS.REJECTED;
      this.setError(e);
      // 如果已经收集一部分依赖则订阅这一部分，否则订阅全部
      if (this.depSet.size) {
        newAsyncDeps = [...this.depSet];
      } else {
        newAsyncDeps = ['*'];
      }
    }

    if (!isEqual(newAsyncDeps, this.asyncDeps)) {
      // TODO: 重新订阅
      // this.msgCenter.unSubscribe(this.asyncDeps, this.)
    }

    this.calculate();
  }

  getDSProxy() {
    this.depSet = new Set();
    const { id, dsMap, depSet } = this;
    const ids = Object.keys(dsMap || {});
    const idSet = new Set(ids);
    return new Proxy({}, {
      get(target, name) {
        // 引用自身，或引入不存在的id，返回undefined
        if (name === id || !idSet.has(name)) {
          return;
        }
        // 收集被引用的数据源id，用于生成dependents
        depSet.add(name);

        const value = get(dsMap, `${name}.value`);
        // 做深度克隆，防止用户篡改数据
        return cloneDeep(value);
      },
    });
  }
}

