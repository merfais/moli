import { message } from 'ant-design-vue';

export function errorLog(options = {}) {
  const { e, msg, showTip } = options;
  if (showTip !== false) {
    let errMessage = typeof e === 'string'
      ? e
      : (e?.message || e?.err_msg || e?.msg || '');
    if (msg) {
      errMessage = `${msg}: ${errMessage}`;
    }
    message.error(errMessage);
  }
  console.error(msg, e);
}
