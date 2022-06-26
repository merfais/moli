/**
 * @param { footer: {}, graphic: [] } options
 */
export default function genGraphic(options = [], { footer } = {}) {
  const graphic = [...options];
  if (footer.show) {
    graphic.push(footer);
  }
  return graphic;
}
