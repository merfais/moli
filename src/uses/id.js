export default function newId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}
