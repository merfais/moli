export default function newId(prefix = 'id', len = 10) {
  return `${prefix}_${Math.random().toString(36).slice(2, 2 + len)}`;
}
