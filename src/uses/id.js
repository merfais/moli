export default function newId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

function random(iMax = 9) {
  const i = Math.round(Math.random() * (iMax - 1)) + 1;
  return String(Math.random() + i).split('.').join('');
}

export function newNumId(bit = 8, max) {
  return `${random(max)}${random()}`.slice(0, bit) * 1;
}

export { newId };
