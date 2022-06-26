export function useDurationFormat(end, start, scale = 1) {
  if (!end || !start) {
    return;
  }
  const num = (end - start) * scale;

  // 小于1秒
  if (num < 1000) {
    return `${num}ms`;
  }
  let s = String(num).slice(0, -3);
  let ms = Number(String(num).slice(-3));
  ms = ms === 0 ? '' : `${ms}`;

  // 小于1分钟
  if (s < 60) {
    return ms ? `${s}.${ms}s` : `${s}s`;
  }

  let m = Math.floor(s / 60);
  s %= 60;

  // 小于1小时
  if (m < 60) {
    return s ? `${m}min ${s}s` : `${m}min`;
  }

  let h = Math.floor(m / 60);
  m %= 60;

  if (h < 24) {
    return m ? `${h}hour ${m}min` : `${h}hour`;
  }

  const d = Math.floor(h / 24);
  h %= 24;
  return h ? `${d}day ${h}hour` : `${d}day`;
}
