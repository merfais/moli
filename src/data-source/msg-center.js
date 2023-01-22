import {
  forEach,
  isFunction,
} from 'lodash-es';

export default class MessageCenter {
  constructor() {
    // 定向事件中心, 订阅时需要指定被订阅对象的key
    this.busMap = new Map();

    // 开放事件中心，订阅时无需指定被订阅的key,
    // 任何对象发布的消息都会被订阅者接收
    this.busSet = new Set();
  }

  destructor() {
    this.busMap = new Map();
    this.busSet = new Set();
  }

  /**
   * 订阅变化
   */
  subscribe = (varKeys, cb, immediate = false) => {
    if (isFunction(varKeys)) {
      this.busSet.add(varKeys);
      if (immediate) {
        varKeys();
      }
      return;
    }
    if (!Array.isArray(varKeys) || !isFunction(cb)) {
      return;
    }
    forEach(varKeys, (key) => {
      if (!this.busMap.has(key)) {
        this.busMap.set(key, new Set());
      }
      const cbSet = this.busMap.get(key);
      cbSet.add(cb);
    });
    if (immediate) {
      cb();
    }
  };

  /**
   * 注销订阅
   */
  unSubscribe = (varKeys, cb) => {
    if (isFunction(varKeys)) {
      this.busSet.delete(varKeys);
      return;
    }
    if (!Array.isArray(varKeys)) {
      return;
    }
    forEach(varKeys, (key) => {
      if (this.busMap.has(key)) {
        const cbSet = this.busMap.get(key);
        cbSet.delete(cb);
        if (cbSet.size === 0) {
          this.busMap.delete(key);
        }
      }
    });
  };

  /**
   * 发布变化, 用于发送给订阅该变量的接收方,
   * 同时也会发送给订阅所有变量变化的接收方
   * @param key 发布变化的对象
   */
  publish = (key, { onlyAll = false } = {}) => {
    forEach([...this.busSet], cb => cb(key));

    // 如果发布给所有订阅者，则不执行定向发布逻辑
    if (onlyAll) {
      return;
    }

    // 定向发布变化
    if (this.busMap.has(key)) {
      const cbs = [...this.busMap.get(key)];
      forEach(cbs, cb => cb(key));
    }
  };

  /**
   * 销毁订阅关系
   * 返回值用于在修改变量type时，转录该变量的订阅关系
   * @param key 被销毁的发布变化对象
   * @return cbList Array 订阅该对象的所有回调函数
   */
  removeKey = (key) => {
    // 变量被删除，触发观察任意变量变化的的所有回调
    forEach([...this.busSet], cb => cb(key));

    // 变量被删除，移除观察此变量的的所有回调
    if (this.busMap.has(key)) {
      const cbs = [...this.busMap.get(key)];
      // 移除前通知订阅此变量的所有回调
      forEach(cbs, cb => cb());
      this.busMap.delete(key);
    }
  };

  /**
   * 销毁订阅关系
   * @param cb 被销毁的接收变化的回调函数
   */
  removeCb = (cb) => {
    // 变量被删除，移除此变量依赖其他变量的更新的回调
    forEach([...this.busMap.values()], (cbSet) => {
      cbSet.delete(cb);
    });
    this.busSet.delete(cb);
  };

  /**
   * 给被订阅的对象批量增加订阅回调
   * @param key string 被订阅的对象
   * @param cbList Array 接收变化的回调函数集合字典
   */
  addCbList = (key, cbList) => {
    if (!this.busMap.has(key)) {
      this.busMap.set(key, new Set(cbList));
    } else {
      const mergedCbs = [...cbList, ...this.busMap.get(key)];
      this.busMap.set(key, new Set(mergedCbs));
    }
  };

  /**
   * 获取被订阅对象的所有回调函数
   * @param key string 被订阅的对象
   */
  getCbList = (key) => {
    if (this.busMap.has(key)) {
      return [...this.busMap.get(key)];
    }
    return [];
  };
}

