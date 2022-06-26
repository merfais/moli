/**
 * 格式化数字，加千分位
 */
export function useCommas(x) {
  const [s, f] = x.toString().split('.');
  const i = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (f) {
    return `${i}.${f}`;
  }
  return i;
}
