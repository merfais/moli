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
    this.msgCenter.subscribe(this.source.getAsyncDeps(), this.request);

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
    this.msgCenter.removeId(this.id);
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
    this.msgCenter.unSubscribe(this.source.getSyncDeps(), this.calculate);
    this.msgCenter.unSubscribe(this.source.getAsyncDeps(), this.request);

    if (config.type && config.type !== this.source.type) {
      const DataSourceClass = getClass(config.type);
      this.source = new DataSourceClass(config);
      this.source.init();
    } else {
      this.source.updateConfig(config);
    }

    // 重新生产依赖关系，重新订阅
    this.source.genDependents();
    this.msgCenter.subscribe(this.source.getSyncDeps(), this.calculate);
    this.msgCenter.subscribe(this.source.getAsyncDeps(), this.request);
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

  getConfig() {
    if (this.source) {
      return this.source.getConfig();
    }
  }

  get name() {
    if (this.source) {
      return this.source.name;
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

