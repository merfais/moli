import {
  forEach,
} from 'lodash-es';

export default class MessageCenter {
  constructor() {
    // 定向事件中心, 订阅时需要指定被订阅对象的dsId
    this.busMap = new Map();

    // 开放事件中心，订阅时无需指定被订阅的dsId,
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
  subscribe = (dsIds, cb, { immediate = false } = {}) => {
    if (typeof cb !== 'function') {
      return;
    }
    if (dsIds === '*') {
      this.busSet.add(cb);
      if (immediate) {
        cb();
      }
      return;
    }
    const ids = Array.isArray(dsIds) ? dsIds : [dsIds];
    forEach(ids, (dsId) => {
      if (!this.busMap.has(dsId)) {
        this.busMap.set(dsId, new Set());
      }
      const cbSet = this.busMap.get(dsId);
      cbSet.add(cb);
    });
    if (immediate) {
      cb();
    }
  };

  /**
   * 注销订阅
   */
  unSubscribe = (dsIds, cb) => {
    if (typeof cb !== 'function') {
      return;
    }
    if (dsIds === '*') {
      this.busSet.delete(cb);
      return;
    }
    const ids = Array.isArray(dsIds) ? dsIds : [dsIds];
    forEach(ids, (dsId) => {
      if (this.busMap.has(dsId)) {
        const cbSet = this.busMap.get(dsId);
        cbSet.delete(cb);
        if (cbSet.size === 0) {
          this.busMap.delete(dsId);
        }
      }
    });
  };

  /**
   * 发布变化, 用于发送给订阅该数据源的接收方,
   * 同时也会发送给订阅所有数据源变化的接收方
   * @param dsId 发布变化的对象
   */
  publish = (dsId, { onlyAll = false } = {}) => {
    forEach([...this.busSet], cb => cb(dsId));

    // 如果发布给所有订阅者，则不执行定向发布逻辑
    if (onlyAll) {
      return;
    }

    // 定向发布变化
    if (this.busMap.has(dsId)) {
      const cbs = [...this.busMap.get(dsId)];
      forEach(cbs, cb => cb(dsId));
    }
  };

  /**
   * 销毁订阅关系
   * 返回值用于在修改数据源type时，转录该数据源的订阅关系
   * @param dsId 被销毁的发布变化对象
   * @return cbList Array 订阅该对象的所有回调函数
   */
  removeId = (dsId) => {
    // 数据源被删除，触发观察任意数据源变化的的所有回调
    forEach([...this.busSet], cb => cb(dsId));

    // 数据源被删除，移除观察此数据源的的所有回调
    if (this.busMap.has(dsId)) {
      const cbs = [...this.busMap.get(dsId)];
      // 移除前通知订阅此数据源的所有回调
      forEach(cbs, cb => cb());
      this.busMap.delete(dsId);
    }
  };

  /**
   * 销毁订阅关系
   * @param cb 被销毁的接收变化的回调函数
   */
  removeCb = (cb) => {
    // 数据源被删除，移除此数据源依赖其他数据源的更新的回调
    forEach([...this.busMap.values()], (cbSet) => {
      cbSet.delete(cb);
    });
    this.busSet.delete(cb);
  };

  /**
   * 给被订阅的对象批量增加订阅回调
   * @param dsId string 被订阅的对象
   * @param cbList Array 接收变化的回调函数集合字典
   */
  addCbList = (dsId, cbList) => {
    if (!this.busMap.has(dsId)) {
      this.busMap.set(dsId, new Set(cbList));
    } else {
      const mergedCbs = [...cbList, ...this.busMap.get(dsId)];
      this.busMap.set(dsId, new Set(mergedCbs));
    }
  };

  /**
   * 获取被订阅对象的所有回调函数
   * @param dsId string 被订阅的对象
   */
  getCbList = (dsId) => {
    if (this.busMap.has(dsId)) {
      return [...this.busMap.get(dsId)];
    }
    return [];
  };
}

