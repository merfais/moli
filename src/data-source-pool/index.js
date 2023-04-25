import {
  get,
  forEach,
} from 'lodash-es';
import MessageCenter from './msg-center';
import DataSource from './data-source';

export * from './constants';

export class DataSourcePool {
  constructor(dataSources, opts = {}) {
    this.dsMap = {};
    this.msgCenter = new MessageCenter();  // 数据源模块通信的事件中心

    const {
      // 异步初始化数据源值标识
      asyncInit,
      // 禁用初始化数据源值标识
      disableInit,
    } = opts;

    // 先完成所有数据源的注册，再统一初始化
    forEach(dataSources, (item) => {
      this.register(item, { withInit: false });
    });

    // 不执行数据源值的初始化，初始化时机交给调用方决定，
    // 默认会执行初始化
    if (disableInit) {
      return;
    }

    // 初始化所有数据源的值
    const execInit = () => {
      forEach(this.dsMap, (item) => {
        item.init();
      });
    };
    // 是否使用制造异步过程初始化数据源的值，默认使用同步过程
    // 调用init的时候会同步publish值变化事件，当初始化后立刻同步执行subscribe，
    // 将无法订阅到init时的变化，也就无法感知数据源的首次变更。
    // 这种场景需要使用异步初始化，可先subscribe， 再publish
    if (asyncInit) {
      setTimeout(execInit);
    } else {
      execInit();
    }
  }

  /**
   * 销毁数据源模块
   */
  destructor() {
    this.msgCenter.destructor();
    this.msgCenter = null;
    forEach(this.dsMap, item => item.destructor());
    this.dsMap = null;
  }

  /**
   * 注销数据源
   * @param dsId string 被注销数据源的dsId
   */
  unRegister(dsId) {
    if (get(this.dsMap, dsId)) {
      const dataSource = this.dsMap[dsId];
      delete this.dsMap[dsId];
      dataSource.destructor();
    }
  }

  /**
   * 注册数据源
   * @param item Object 数据源配置描述数据
   * @param extOpts Object 额外的参数
   */
  register(config, extOpts = {}) {
    const { id } = config;
    this.unRegister(id);

    const { dsMap, msgCenter } = this;
    const dataSource = new DataSource({
      ...config,
      dsMap,
      msgCenter,
    });
    dsMap[id] = dataSource;

    // 需要先注册再初始化，否则在订阅变化的回调中拿不到数据源索引
    // 但初始化所有数据源时，不执行init，需要所有数据源都注册后再统一init
    if (extOpts.withInit !== false) {
      dataSource.init();
    }
  }

  /**
   * 更新数据源配置
   * @param item Object 数据源配置描述数据
   */
  update(item) {
    const { oldId, ...restConf } = item;
    const { id } = item;
    const { dsMap } = this;
    // 修改id，丢弃所有依赖订阅关系
    if (oldId && oldId !== id) {
      let config = { ...restConf };
      if (dsMap[oldId]) {
        config = { ...dsMap[oldId].getConfig(), ...restConf };
        this.unRegister(oldId);
      }
      this.register(config);
      return;
    }
    if (dsMap[id]) {
      dsMap[id].update(restConf);
    } else {
      // 数据源字典中没有找到，则执行注册
      this.register(restConf);
    }
  }

  /**
   * 修改数据源的值
   * @param dsId string 数据源的dsId
   * @param payload Object 数据源的值描述数据
   */
  setValue(arg1, arg2) {
    let dsId = arg1;
    let value = arg2;
    if (typeof arg1 === 'object') {
      ({ dsId, value } = arg1);
    }
    const { dsMap } = this;
    if (dsMap[dsId]) {
      dsMap[dsId].setValue(value);
    }
  }

  /**
   * 获取数据源配置
   */
  getConfig(dsId) {
    const { dsMap } = this;
    if (dsMap[dsId]) {
      return dsMap[dsId].getConfig();
    }
    return {};
  }

  getDsConfig() {
    const dsConfig = {};
    forEach(this.dsMap, (item, key) => {
      dsConfig[key] = item.getConfig();
    });
    return dsConfig;
  }

  /**
   * 订阅数据源变化, 需要指定被订阅的数据源dsId list
   */
  subscribe(...args) {
    return this.msgCenter.subscribe(...args);
  }

  /**
   * 取消订阅数据源变化
   */
  unSubscribe(...args) {
    return this.msgCenter.unSubscribe(...args);
  }

  /**
   * 尝试更新数据源
   * @param item Object 数据源配置描述数据
   * @return dsConfMap 全新的数据源配置描述字段
   */
  dryRunUpdate(item = {}) {
    const { oldId, id } = item;
    const { dsMap } = this;
    const dsConfMap = {};
    forEach(dsMap, (item) => {
      const { id, getConfig } = item;
      dsConfMap[id] = getConfig();
    });
    // 修改id
    if (oldId && oldId !== id) {
      delete dsConfMap[oldId];
    }
    dsConfMap[id] = (new DataSource(item)).getConfig();
    return dsConfMap;
  }
}

