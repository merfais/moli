import {
  DATA_SOURCE_TYPE,
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
  // 数据源的id
  id = '';

  calculate = () => this.source?.calculate && this.source.calculate();

  request = () => this.source?.request && this.source.request();

  constructor(info) {
    const { id, dsMap, msgCenter } = info;
    Object.assign(this, { id, dsMap, msgCenter });

    const DataSourceClass = getClass(info.type);
    this.source = new DataSourceClass(info);
    this.source.genDependents();
    this.msgCenter.subscribe(this.source.getSyncDeps(), this.calculate);
    this.msgCenter.subscribe(this.source.getASyncDeps(), this.request);

    // this.calculateValue = this.calculateValue.bind(this);
    // this.requestData = this.requestData.bind(this);
  }

  /**
   * 注销数据源时，释放该数据源的引用
   */
  destructor() {
    if (this.source?.destructor) {
      this.source.destructor();
    }
    this.source = null;
    this.msgCenter.removeCb(this.calculate);
    this.msgCenter.removeCb(this.request);
    this.msgCenter.removeKey(this.id);
  }

  init() {
    if (this.source?.init) {
      this.source.init();
    }
  }

  /**
   * 被外部调用的，用于修改数据源属性配置,
   * 会被子类调用，子类执行计算value的逻辑，触发publish
   */
  update(config = {}) {
    // 解除订阅关系
    const { getSyncDeps, getAsyncDeps } = this.source;
    this.msgCenter.unSubscribe(getSyncDeps(), this.calculate);
    this.msgCenter.unSubscribe(getAsyncDeps(), this.request);

    if (config.type !== this.source.type) {
      const DataSourceClass = getClass(config.type);
      this.source = new DataSourceClass(config);
      this.source.init();
    } else {
      this.source.updateConfig(config);
    }

    // 重新生产依赖关系，重新订阅
    this.source.genDependents();
    this.msgCenter.subscribe(getSyncDeps(), this.calculate);
    this.msgCenter.subscribe(getAsyncDeps(), this.request);
  }

  setValue(config) {
    if (this.source) {
      this.source.setValue(config);
    }
  }

  setError(...args) {
    if (this.source) {
      return this.source.setError(...args);
    }
  }

  get value() {
    if (this.source) {
      return this.source.getValue();
    }
  }

  get status() {
    if (this.source) {
      return this.source.getStatus();
    }
  }

  get errMsg() {
    if (this.source) {
      return this.source.getErrMsg();
    }
  }
}


// /**
//  * 更新同步依赖关系, 更新订阅
//  */
// updateSyncDepDSs() {
//   this.msgCenter.unSubscribe(this.syncDeps, this.calculateValue);
//   const newDepDSs = this.genDependentDSs();
//   this.syncDeps = newDepDSs;
//   this.msgCenter.subscribe(this.syncDeps, this.calculateValue);
// }

// /**
//  * 更新异步依赖关系, 更新订阅,
//  */
// updateAsyncDeps() {
//   this.msgCenter.unSubscribe(this.asyncDeps, this.requestData);
//   const newDepDSs = this.genDependentDSs();
//   this.asyncDeps = newDepDSs;
//   this.msgCenter.subscribe(this.asyncDeps, this.requestData);
// }
// // 数据源的值
// set value(value) {
//   this.source.setValue(value);
// }

// get value() {
//   return this.source.getValue();
// }

// // 只读接口
// // 此数据源的依赖数据源
// set dependents(value) {}

// get dependents() {
//   return this.source.getDependents();
// }

// // 此数据源的状态，同时会计算上游的状态，形成依赖树
// set status(value) {
//   this.innerStatus = value;
// }

// get status() {
//   if (this.syncUpperIsPending || this.asyncUpperIsPending) {
//     return ASYNC_STATUS.PENDING;
//   }
//   return this.innerStatus;
// }

// // 上游数据源的错误栈。有两个作用。
// // 1、异步数据源求值时如果上游数据源有错误，有可能不发起请求。
// // 2、导出数据源的错误消息时，需要导出整个栈的错误
// getUpperError() {
//   const errorStack = [];
//   forEach(this.dependents, (varKey) => {
//     const error = get(this.dsMap, `${varKey}.error`, []);
//     errorStack.concat(error);
//     // 数据源的依赖关系是树状结构，但错误存储结构是栈，
//     // 因此只考虑树的某一个局部深度，当收集到依赖的错误就不再继续查找了
//     if (errorStack.length) {
//       return false;
//     }
//   });
//   return errorStack;
// }

// // 数据源的错误栈。这是一个反向的栈，此数据源的错误位于栈底，上游数据源的错误位于栈顶
// set error(value) {
//   let error = value;
//   if (typeof value === 'string') {
//     error = { message: value };
//   }
//   this.innerError = error;
// }

// get error() {
//   const errorStack = [];
//   if (this.innerError) {
//     errorStack.push({
//       id: this.id,
//       error: this.innerError,
//     });
//   }
//   errorStack.concat(this.getUpperError());
//   return errorStack;
// }

// /**
//  * 读取数据源的错误消息
//  */
// getErrMsg() {
//   if (!this.error.length) {
//     return '';
//   }
//   const msgStack = map(this.upperError, ({ id, error } = {}) => {
//     const { message } = error;
//     return `上游数据源${id}计算出错: ${message}`;
//   });
//   if (this.innerError) {
//     const { message } = this.innerError;
//     msgStack.unshift(`${message}`);
//   }
//   return `数据源${this.id}计算出错: ${msgStack.join(';=>')}`;
// }

// /**
//  * 组装持久化的配置
//  */
// getConfig() {
//   return this.source.getConfig();
// }


// /**
//  * 写数据源的值，如果值或状态发生变化会发布事件
//  */
// updateValue(value) {
//   this.innerValue = value;
//   const valueHasChange = !isEqual(this.value, this.oldValue);
//   const statusHasChange = this.status !== this.oldStatus;
//   const errorHasChange = !isEqual(this.error, this.oldError);

//   this.oldValue = this.value;
//   this.oldStatus = this.status;
//   this.oldError = this.error;

//   // 做diff，避免频繁更新，也可阻挡一定的循环引用更新
//   if (valueHasChange || statusHasChange || errorHasChange) {
//     // 发布变化
//     this.msgCenter.publish(this.id);
//   }
// }

// /**
//  * 用于计算上游数据源状态, 被子类调用
//  * 在不同的场景下，上游数据源不相同，
//  * 1. 同步数据源： 上游数据源是固定的，读syncDeps的值，决定是否更新value值
//  * 2. 异步数据源： 不固定，异步请求前判断 asyncDeps, 决定是否发起请求
//  *                       执行后置函数判断 syncDeps，决定是否更新value值
//  */
// calcUpperIsPending(depDSs) {
//   // 上游数据源，被依赖的数据源是否是pending状态
//   let hasPending = false;
//   forEach(depDSs, (varKey) => {
//     hasPending = get(this.dsMap, `${varKey}.status`) === ASYNC_STATUS.PENDING;
//     return !hasPending;
//   });
//   return hasPending;
// }

// /**
//  * 被子类重写的多态接口
//  * 同步过程，计算value的值，用于响应依赖数据源消息
//  */
// calculateValue() { }

// /**
//  * 被子类重写的多态接口
//  * 异步过程，网络请求，用于响应依赖数据源消息
//  */
// requestData() { }

// /**
//  * 被子类重写的多态接口
//  * 计算生成该数据源的依赖数据源，
//  */
// genDependentDSs() {
//   return [];
// }

// /**
//  * 获取订阅了此数据源的所有的回调函数
//  */
// getCbList() {
//   return this.msgCenter.getCbList(this.id);
// }
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


