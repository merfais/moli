import {
  has,
  get,
  map,
  forEach,
  isEqual,
} from 'lodash-es';
import {
  DATA_SOURCE_TYPE,
  ASYNC_STATUS,
} from './constants';
import InputLikeView from './input-like-view';
import SelectLikeView from './select-like-view';
import JsFunction from './js-function';
import Base from './base';

function getClass(type) {
  const classMap = {
    [DATA_SOURCE_TYPE.INPUT_LIKE_VIEW]: InputLikeView,
    [DATA_SOURCE_TYPE.SELECT_LIKE_VIEW]: SelectLikeView,
    [DATA_SOURCE_TYPE.JS_FUNCTION]: JsFunction,
  };
  if (classMap[type]) {
    return classMap[type];
  }
  return Base;
}

export default class DataSource {
  // 数据源类型
  type = '';

  // 数据源的id
  id = '';

  // 数据源的名字
  name = '';

  // 用于存储数据源的参数
  // options = {};

  // 修改数据源时，修改的值存在tmpData字段，
  // 因为要在多个函数中传递此值，且可能会多次被调用执行，因此要缓存到this中
  tmpData = null;

  // 数据源的真实值（导出值）存放在innerValue字段
  innerValue = null;

  // 数据源的值变更前的值，用于脏检查
  oldValue = null;

  // 数据源的状态，初始时PENDING，执行init后才会计算求值，再设置为FULFILLED
  innerStatus = ASYNC_STATUS.PENDING;

  // 数据源的状态变更前的值，用于脏检查
  oldStatus = ASYNC_STATUS.PENDING;

  // 数据源求值过程中出现的错误
  innerError = null;

  // 数据源的错误更新前的值，用于脏检查
  oldError = null;

  // 依赖的数据源列表，订阅这些数据源变化后执行同步逻辑
  syncDepDSs = [];

  // 上游数据源是否处于pending态
  syncUpperIsPending = false;

  // 依赖的数据源列表，订阅这些数据源变化后执行异步逻辑
  asyncDepDSs = [];

  // 上游数据源是否处于pending态
  asyncUpperIsPending = false;

  // 数据源组唯一id
  sid = 'sid';

  // 标记数据源是否已经初始化
  hasInited = false;

  // 编辑数据源是否已经销毁
  hasDestroyed = false;

  constructor(info) {
    const {
      type,
      dsMap,
      msgCenter,
      // 不同数据源的options字段各有差异
      // options = {},
      // rest包含的字段
      // type            数据源类型, 通用字段
      // id,            数据源的id, 通用字段
      // name,           数据源的名字, 通用字段
      // ...rest
    } = info;

    Object.assign(this, {
      dsMap,
      msgCenter,
    });

    // rest.tmpData = value;
    // Object.assign(this, rest);
    // Object.assign(this.options, options)

    const DataSourceClass = getClass(type);
    this.source = new DataSourceClass(info);

    // this.calculateValue = this.calculateValue.bind(this);
    // this.requestData = this.requestData.bind(this);
  }

  /**
   * 注销数据源时，释放该数据源的引用
   */
  destructor() {
    this.hasDestroyed = true;
    this.msgCenter.removeCb(this.source.calculateValue);
    this.msgCenter.removeCb(this.source.requestData);
    this.msgCenter.removeKey(this.id);
  }

  // 数据源的值
  set value(value) {
    this.source.setValue(value);
  }

  get value() {
    return this.source.getValue();
  }

  // 只读接口
  // 此数据源的依赖数据源
  set dependents(value) {}

  get dependents() {
    return this.source.getDependents();
  }

  // 此数据源的状态，同时会计算上游的状态，形成依赖树
  set status(value) {
    this.innerStatus = value;
  }

  get status() {
    if (this.syncUpperIsPending || this.asyncUpperIsPending) {
      return ASYNC_STATUS.PENDING;
    }
    return this.innerStatus;
  }

  // 上游数据源的错误栈。有两个作用。
  // 1、异步数据源求值时如果上游数据源有错误，有可能不发起请求。
  // 2、导出数据源的错误消息时，需要导出整个栈的错误
  getUpperError() {
    const errorStack = [];
    forEach(this.dependents, (varKey) => {
      const error = get(this.dsMap, `${varKey}.error`, []);
      errorStack.concat(error);
      // 数据源的依赖关系是树状结构，但错误存储结构是栈，
      // 因此只考虑树的某一个局部深度，当收集到依赖的错误就不再继续查找了
      if (errorStack.length) {
        return false;
      }
    });
    return errorStack;
  }

  // 数据源的错误栈。这是一个反向的栈，此数据源的错误位于栈底，上游数据源的错误位于栈顶
  set error(value) {
    let error = value;
    if (typeof value === 'string') {
      error = { message: value };
    }
    this.innerError = error;
  }

  get error() {
    const errorStack = [];
    if (this.innerError) {
      errorStack.push({
        id: this.id,
        error: this.innerError,
      });
    }
    errorStack.concat(this.getUpperError());
    return errorStack;
  }

  /**
   * 读取数据源的错误消息
   */
  getErrMsg() {
    if (!this.error.length) {
      return '';
    }
    const msgStack = map(this.upperError, ({ id, error } = {}) => {
      const { message } = error;
      return `上游数据源${id}计算出错: ${message}`;
    });
    if (this.innerError) {
      const { message } = this.innerError;
      msgStack.unshift(`${message}`);
    }
    return `数据源${this.id}计算出错: ${msgStack.join(';=>')}`;
  }

  /**
   * 组装持久化的配置
   */
  getConfig() {
    return this.source.getConfig();
  }

  /**
   * 更新同步依赖关系, 更新订阅
   */
  updateSyncDepDSs() {
    this.msgCenter.unSubscribe(this.syncDepDSs, this.calculateValue);
    const newDepDSs = this.genDependentDSs();
    this.syncDepDSs = newDepDSs;
    this.msgCenter.subscribe(this.syncDepDSs, this.calculateValue);
  }

  /**
   * 更新异步依赖关系, 更新订阅,
   */
  updateAsyncDepDSs() {
    this.msgCenter.unSubscribe(this.asyncDepDSs, this.requestData);
    const newDepDSs = this.genDependentDSs();
    this.asyncDepDSs = newDepDSs;
    this.msgCenter.subscribe(this.asyncDepDSs, this.requestData);
  }

  /**
   * 被外部调用的，用于修改数据源属性配置,
   * 会被子类调用，子类执行计算value的逻辑，触发publish
   */
  update(payload = {}) {
    // const { value, options = {}, ...rest } = payload
    const { value, ...rest } = payload;
    Object.assign(this, rest);
    // if (options) {
    //   Object.assign(this.options, options);
    // }
    if (has(payload, 'value')) {
      this.tmpData = value;
    }

    if (this.isAsync) {
      this.updateAsyncDepDSs();
      this.requestData();
    } else {
      this.updateSyncDepDSs();
      this.calculateValue();
    }

    this.msgCenter.publish(this.id, { toAll: true });
  }

  /**
   * 写数据源的值，如果值或状态发生变化会发布事件
   */
  updateValue(value) {
    this.innerValue = value;
    const valueHasChange = !isEqual(this.value, this.oldValue);
    const statusHasChange = this.status !== this.oldStatus;
    const errorHasChange = !isEqual(this.error, this.oldError);

    this.oldValue = this.value;
    this.oldStatus = this.status;
    this.oldError = this.error;

    // 做diff，避免频繁更新，也可阻挡一定的循环引用更新
    if (valueHasChange || statusHasChange || errorHasChange) {
      // 发布变化
      this.msgCenter.publish(this.id);
    }
  }

  /**
   * 用于计算上游数据源状态, 被子类调用
   * 在不同的场景下，上游数据源不相同，
   * 1. 同步数据源： 上游数据源是固定的，读syncDepDSs的值，决定是否更新value值
   * 2. 异步数据源： 不固定，异步请求前判断 asyncDepDSs, 决定是否发起请求
   *                       执行后置函数判断 syncDepDSs，决定是否更新value值
   */
  calcUpperIsPending(depDSs) {
    // 上游数据源，被依赖的数据源是否是pending状态
    let hasPending = false;
    forEach(depDSs, (varKey) => {
      hasPending = get(this.dsMap, `${varKey}.status`) === ASYNC_STATUS.PENDING;
      return !hasPending;
    });
    return hasPending;
  }

  /**
   * 被子类重写的多态接口
   * 同步过程，计算value的值，用于响应依赖数据源消息
   */
  calculateValue() { }

  /**
   * 被子类重写的多态接口
   * 异步过程，网络请求，用于响应依赖数据源消息
   */
  requestData() { }

  /**
   * 被子类重写的多态接口
   * 计算生成该数据源的依赖数据源，
   */
  genDependentDSs() {
    return [];
  }

  /**
   * 获取订阅了此数据源的所有的回调函数
   */
  getCbList() {
    return this.msgCenter.getCbList(this.id);
  }
}

// // 只读接口
// // 上游数据源的错误信息
// set upperStatus(value) {}
// get upperStatus() {
//   const dsMap = getVarMap(this.sid);
//   return map(this.dependentDSs, (varKey) => {
//     const path = `${varKey}.status`;
//     return get(dsMap, path, ASYNC_STATUS.FULFILLED);
//   });
// }

// // 只读接口
// // 用于导出持久化数据是，存放default的数据
// // 值是静态的数据源导出的就是value的值，值是动态的导出值由子类重载实现
// set dftVal(value) {}
// get dftVal() {
//   return this.value;
// }
// /**
//  * 更新数据源的值，用于组件导出的数据源，在数据源模块外调用
//  */
// setValue(payload = {}) {
//   const { default: tmpData, options = {} } = payload;
//   this.tmpData = tmpData;
//   Object.assign(this.options, options);
//   this.calculateValue();
// }

// /**
//  * 重新value前缓存旧的数据，用于更新value后做脏数据检查
//  */
// updateOldValue() {
//   this.oldValue = this.value;
//   // 记录旧的status的值，存在status变化，但value未变化的场景
//   this.oldStatus = this.status;
//   // 记录旧的error的值，存在error变化，但value未变化的场景
//   this.oldError = this.error;
// }

// /**
//  * 更新数据源自身的异步状态, 并发布状态变化事件通知依赖方
//  */
// updateStatus(status, { disablePublish } = {}) {
//   // 忽略重复更新
//   if (this.innerStatus === status) {
//     return;
//   }
//   this.innerStatus = status;
//   // FIXME: 是否需要 enablePublish
//   if (!disablePublish) {
//     this.publish(this.id);
//   }
// }

//  /**
//  * 更新数据源的错误信息，根据参数enablePublish决定是否发布变化，
//  * 因存在值为发生变化但错误有更新的请求，
//  * 因此，错误变化在一定的情况下也要发布变化
//  */
// updateError(payload, { enablePublish } = {}) {
//   let error = payload;
//   if (typeof payload === 'string') {
//     error = { message: payload };
//   }
//   // 忽略重复更新
//   if (isEqual(this.innerError, error)) {
//     return;
//   }
//   this.innerError = error;
//   // FIXME: 是否需要 enablePublish
//   if (enablePublish) {
//     this.publish(this.id);
//   }
// }


