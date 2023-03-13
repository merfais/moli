/**
 * end 结束时间戳
 * start 开始时间戳
 * scale 时间戳单位，x = 毫秒，X = 秒
 */
export function useDurationFormat(end, start = 'X', format = 'X') {
  if (!end) {
    return end;
  }
  let num;
  let scale = format;
  if (start === 'x' || start === 'X') {
    num = end;
    scale = start;
  } else if (start) {
    num = end - start;
  } else {
    return;
  }
  num = scale === 'X' ? num * 1000 : num;

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


