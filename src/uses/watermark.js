export default function useWatermark(str) {
  const id = 'watermark';
  const father = document.body;
  if (document.getElementById(id) !== null) {
    father.removeChild(document.getElementById(id));
  }

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;

  const ctx = canvas.getContext('2d');
  ctx.rotate((-20 * Math.PI) / 180);
  ctx.font = '26px Vedana';
  ctx.fillStyle = 'rgba(200, 200, 200, 0.35)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'Middle';
  ctx.fillText(str, canvas.width / 5, canvas.height);

  const div = document.createElement('div');
  div.id = id;

  father.appendChild(div);
  div.style.pointerEvents = 'none';
  div.style.bottom = '0';
  div.style.right = '0';
  div.style.top = '0';
  div.style.left = '0';
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.background = `url(${canvas.toDataURL('image/png')}) left top repeat`;
}
