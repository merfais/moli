import {
  get,
  pick,
} from 'lodash-es';
import { MODE } from './constants';
import {
  genTitle,
  genLegend,
  genTooltip,
  genGraphic,
  genBackgroudColor,
  genXAxis,
  genYAxis,
  genGrid,
  genFooter,
  genDataset,
} from './options';
import genSeries from './options/xySeries';

export default function genOption({
  type,
  name,
  seriesType,
  xAxisType = 'category',
  yAxisType = 'value',
  // percent, TODO:
  stack,
  area,
} = {}) {
  return ({
    option = {},
    data,
    dataOption = {},
    mode = MODE.PC,
  } = {}) => {
    const { dataset, dimName } = genDataset(data, { dataOption });
    const series = genSeries(option.series, {
      mode,
      seriesType,
      stack,
      area,
      dataset,
      dimName,
      dataOption,
      xAxisType,
      xAxis: option.xAxis,
      color: option.color,
    });
    const xAxis = genXAxis(option.xAxis, {
      mode, xAxisType, series, dataset,
    });
    const yAxis = genYAxis(option.yAxis, {
      mode, yAxisType, series, dataset,
    });
    const footer = genFooter(get(option, 'footer', {}), mode);
    const title = genTitle(option.title, mode);
    const legend = genLegend(option.legend, {
      footer, type, series, mode,
    });
    const tooltip = genTooltip(option.tooltip, { mode, type, series });
    const backgroundColor = genBackgroudColor(option.backgroundColor, {
      watermark: option.watermark,
      mode,
    });
    const graphic = genGraphic(option.graphic, { footer, mode });
    const grid = genGrid(option.grid, {
      footer, mode, title, legend,
    });

    const result = {
      type,
      name,
      ...pick(option, ['color']),
      title,
      series,
      legend,
      grid,
      xAxis,
      yAxis,
      tooltip,
      backgroundColor,
      graphic,
      dataset: { source: dataset },
    };
    return result;
  };
}
