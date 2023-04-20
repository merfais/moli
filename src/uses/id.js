function randomStr() {
  return Math.random().toString(36).slice(2);
}
export default function newId(arg1 = 'id', arg2 = 8) {
  let prefix = arg1;
  let max = arg2;
  if (/^\d+$/.test(prefix)) {
    prefix = 'id';
    max = Number(arg1);
  }
  const str = max > 16
    ? `${randomStr()}${randomStr()}${randomStr()}`
    : `${randomStr()}${randomStr()}`;
  return `${prefix}_${str.slice(0, max)}`;
}

function random(iMax = 9) {
  const i = Math.round(Math.random() * (iMax - 1)) + 1;
  return String(Math.random() + i).split('.').join('');
}

export function newNumId(bit = 8, max) {
  return `${random(max)}${random()}`.slice(0, bit) * 1;
}

export { newId };
