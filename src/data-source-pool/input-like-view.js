import Base from './base';

export default class InputLikeView extends Base {
  // // 组件导出的变量可直接更新value
  // set value(data) {
  //   this.data = data
  //   this.calculateValue();
  // }

  // /**
  //  * 同步过程，计算value的值，用于响应依赖变量消息
  //  */
  // calculateValue() {
  //   this.error = null
  //   const { data } = this;
  //   const { valueType } = this.options
  //   try {
  //     const value = Array.isArray(data)
  //       ? map(data, item => convertValueType(item, valueType))
  //       : convertValueType(data, valueType);
  //     this.status = ASYNC_STATUS.FULFILLED
  //     this.updateValue(value);
  //   } catch (error) {
  //     this.error = error
  //     this.status = ASYNC_STATUS.REJECTED
  //   }
  // }

}
