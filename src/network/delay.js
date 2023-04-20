export default function delay(ms = 500) {
  return new Promise(r => setTimeout(r, ms));
}
