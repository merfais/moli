/**
 * 格式化数字，加千分位
 */
export function useCommas(x) {
  if (x === undefined || x === null) {
    return;
  }
  const [s, f] = x.toString().split('.');
  const i = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (f) {
    return `${i}.${f}`;
  }
  return i;
}

/**
 * 保留N位小数，四舍五入
 */
export function toFixed(x, n = 0) {
  if (x === undefined || x === null) {
    return;
  }
  // 科学计数法的浮点类型数，大数，不做处理直接返回
  if (/e\+?\d+/.test(x)) {
    return x;
  }
  if (n <= 0) {
    return Math.round(x);
  }
  let tmp = String(Math.round(x * (10 ** n)));
  while (tmp.length <= n) {
    tmp = `0${tmp}`;
  }
  const int = tmp.slice(0, -n);
  const float = tmp.slice(-n);
  return Number(`${int}.${float}`);
}
