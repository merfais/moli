import {
  has,
  get,
  map,
  forEach,
  isEqual,
  cloneDeep,
} from 'lodash-es';
import {
  ASYNC_STATUS,
} from './constants';

export default class Base {
  dsMap = {};

  msgCenter = {};

  // 数据源类型
  type = '';

  // 数据源的id
  id = '';

  // 数据源的名字
  name = '';

  // 数据源值类型
  valueType = '';

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
  staticDeps = [];

  // js中依赖的数据源
  jsDeps = [];

  // js中依赖的数据源，用于计算时存临时数据
  jsDepSet = new Set();

  // 标记数据源是否已经初始化
  hasInited = false;

  // 编辑数据源是否已经销毁
  hasDestroyed = false;

  constructor(info) {
    const { value, ...rest } = info;

    rest.tmpData = value;
    Object.assign(this, rest);
  }

  destructor() {
    this.hasDestroyed = true;
  }

  init() {
    this.hasInited = true;
    this.runProcess();
  }

  getValue() {
    // 当值为undefined时，这个id会在网络传输中被删除
    // 因此，当没有值时，返回null， 而不是undefined
    if (this.innerValue === undefined) {
      return null;
    }
    return this.innerValue;
  }

  getStaticDeps() {
    return this.staticDeps;
  }

  getJsDeps() {
    return this.jsDeps;
  }

  getDependents() {
    return [...new Set([...this.staticDeps, ...this.jsDeps])];
  }

  async genDependents() {
    await this.genStaticDeps();
    await this.genJsDeps();
  }

  async genStaticDeps() {
    this.staticDeps = [];
  }

  async genJsDeps() {
    this.jsDeps = [];
  }

  updateConfig(payload) {
    const { value, ...conf } = payload;
    Object.assign(this, conf);

    if (has(payload, 'value')) {
      this.tmpData = value;
    }
    this.runProcess();
  }

  setValue(value) {
    this.tmpData = value;
    this.runProcess();
  }

  async runProcess() {
    this.innerStatus = ASYNC_STATUS.PENDING;
    this.setError();
    await this.calculate();
    await this.invokeJs();
    this.publish();
  }

  /**
   * 执行计算逻辑，在子类中实现对应的逻辑
   */
  async calculate() {
    // this.innerValue = this.tmpData;
    // this.innerStatus = ASYNC_STATUS.FULFILLED;
  }

  /**
   * 执行js逻辑，在子类中实现对应的逻辑
   */
  async invokeJs() {
    // this.innerValue = this.tmpData;
    // this.innerStatus = ASYNC_STATUS.FULFILLED;
  }

  getDSProxy() {
    this.jsDepSet = new Set();
    const { id, dsMap, jsDepSet } = this;
    const idSet = new Set(Object.keys(dsMap || {}));
    return new Proxy({}, {
      get(target, name) {
        // 引用自身，或引入不存在的id，返回undefined
        if (name === id || !idSet.has(name)) {
          return;
        }
        // 收集被引用的数据源id，用于生成dependents
        jsDepSet.add(name);

        const value = get(dsMap, `${name}.value`);
        // 做深度克隆，防止用户篡改数据
        return cloneDeep(value);
      },
    });
  }

  /**
   * 如果值或状态发生变化会发布事件
   */
  publish() {
    const newValue = this.getValue();
    const newStatus = this.getStatus();
    const newError = this.getError();
    const valueHasChange = !isEqual(newValue, this.oldValue);
    const statusHasChange = newStatus !== this.oldStatus;
    const errorHasChange = !isEqual(newError, this.oldError);

    this.oldValue = newValue;
    this.oldStatus = newStatus;
    this.oldError = newError;

    // 做diff，避免频繁更新，也可阻挡一定的循环引用更新
    if (valueHasChange || statusHasChange || errorHasChange) {
      // 发布变化
      this.msgCenter.publish(this.id);
    }
  }

  getStatus() {
    const pending = this.isPending(this.getDependents());
    if (pending) {
      return ASYNC_STATUS.PENDING;
    }
    return this.innerStatus;
  }

  /**
   * 计算上游数据源状态
   */
  isPending(dependents) {
    // 上游数据源，被依赖的数据源是否是pending状态
    let hasPending = false;
    forEach(dependents, (depId) => {
      hasPending = get(this.dsMap, `${depId}.status`) === ASYNC_STATUS.PENDING;
      return !hasPending;
    });
    return hasPending;
  }

  // 数据源的错误栈。这是一个反向的栈，此数据源的错误位于栈底，上游数据源的错误位于栈顶
  setError(message) {
    let error = message;
    if (message && typeof message === 'string') {
      error = { message };
    }
    this.innerError = error;
  }

  getError() {
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

  // 上游数据源的错误栈。有两个作用。
  // 1、异步数据源求值时如果上游数据源有错误，有可能不发起请求。
  // 2、导出数据源的错误消息时，需要导出整个栈的错误
  getUpperError() {
    const errorStack = [];
    forEach(this.getDependents, (depId) => {
      const error = get(this.dsMap, `${depId}.error`, []);
      errorStack.concat(error);
      // 数据源的依赖关系是树状结构，但错误存储结构是栈，
      // 因此只考虑树的某一个局部深度，当收集到依赖的错误就不再继续查找了
      if (errorStack.length) {
        return false;
      }
    });
    return errorStack;
  }

  /**
   * 读取数据源的错误消息
   */
  getErrMsg() {
    if (!this.getError().length) {
      return '';
    }
    const msgStack = map(this.getUpperError(), ({ id, error } = {}) => {
      const { message } = error;
      return `上游数据源${id}计算出错: ${message}`;
    });
    if (this.innerError) {
      const { message } = this.innerError;
      msgStack.unshift(`${message}`);
    }
    return `数据源${this.id}计算出错: ${msgStack.join(';=>')}`;
  }

  getConfig() {
    const config = {
      type: this.type,
      id: this.id,
      name: this.name,
      valueType: this.valueType,
      value: cloneDeep(this.getValue()),
    };
    return config;
  }
}

