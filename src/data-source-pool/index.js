import {
  get,
  forEach,
} from 'lodash-es';
import MessageCenter from './msg-center';
import DataSource from './data-source';

export default class DataSourcePool {
  constructor(dataSources, opts = {}) {
    this.dsMap = {};
    this.commonOpts = {};
    this.msgCenter = new MessageCenter();  // 数据源模块通信的事件中心

    const {
      // 异步初始化数据源值标识
      asyncInit,
      // 禁用初始化数据源值标识
      disableInit,
      // 数据源通用参数
      ...common
    } = opts;

    // 公共参数
    Object.assign(this.commonOpts, common);

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
      // 因为用到了事件中心，删除数据源引用后，要清理事件中心的引用关系
      // 返回订阅该数据源的所有回调函数，用于修改数据源type时转录订阅关系
      dataSource.destructor();
    }
  }

  /**
   * 注册数据源
   * @param item Object 数据源配置描述数据
   * @param extOpts Object 额外的参数
   */
  register(config, extOpts = {}) {
    const { dsId } = config;
    this.unRegister(dsId);

    const { dsMap, msgCenter } = this;
    const dataSource = new DataSource({
      ...config,
      dsMap,
      msgCenter,
    });
    dsMap[dsId] = dataSource;

    // 需要先注册再初始化，否则在订阅变化的回调中拿不到数据源索引
    // 但初始化所有数据源时，不执行init，需要所有数据源都注册后再统一init
    if (extOpts.withInit) {
      dataSource.init();
    }

    // // 转录订阅关系，只在修改type时才会生效
    // // 因为数据源注册后会发布消息，所以订阅关系要在数据源注册前完成，
    // if (cbList) {
    //   const msgCenter = getMsgCenter(sid);
    //   msgCenter.addKey(dsId, cbList);
    // }
  }

  /**
   * 更新数据源配置
   * 因为每种数据源都有对应的类实现，所以修改数据源类型需要注销后再注册
   * @param item Object 数据源配置描述数据
   */
  update(item) {
    const { oldId, oldType, ...rest } = item;
    const { dsId } = rest;
    // const { dsId, type } = rest;
    const { dsMap } = this;
    // 修改dsId，丢弃所有依赖订阅关系
    if (oldId && oldId !== dsId) {
      this.unRegister(oldId);
      this.register(rest);
      return;
    }
    // // 修改类型，保留所有依赖订阅关系
    // if (oldType && oldType !== type) {
    //   const cbList = getMsgCenter(sid).getCbList(dsId)
    //   unRegister(sid, oldId);
    //   register(sid, rest, { cbList });
    // }
    if (dsMap[dsId]) {
      // 修改其他字段，执行update
      dsMap[dsId].update(rest);
    } else {
      // 数据源字典中没有找到，则执行注册
      this.register(rest);
    }
  }

  /**
   * 修改数据源的值
   * @param dsId string 数据源的dsId
   * @param payload Object 数据源的值描述数据
   */
  setDataSourceValue(dsId, payload) {
    const { dsMap } = this;
    if (dsMap[dsId]) {
      dsMap[dsId].setValue(payload);
    }
  }

  /**
   * 订阅数据源变化, 需要指定被订阅的数据源dsId list
   */
  subscribe(...args) {
    this.msgCenter.subscribe(...args);
  }

  /**
   * 取消订阅数据源变化
   */
  unSubscribe(...args) {
    this.msgCenter.unSubscribe(...args);
  }

  /**
   * 尝试更新数据源
   * @param item Object 数据源配置描述数据
   * @return dsConfMap 全新的数据源配置描述字段
   */
  dryRunUpdate(item = {}) {
    const { oldId, dsId } = item;
    const { dsMap } = this;
    const dsConfMap = {};
    forEach(dsMap, (item) => {
      const { dsId, getConfig } = item;
      dsConfMap[dsId] = getConfig();
    });
    // 修改dsId
    if (oldId && oldId !== dsId) {
      delete dsConfMap[oldId];
    }
    dsConfMap[dsId] = (new DataSource(item)).getConfig();
    return dsConfMap;
  }
}

