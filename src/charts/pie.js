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
  genFooter,
  genDataset,
} from './options';
import genSeries from './options/pieSeries';

export default function genOption(type, name) {
  return ({
    option = {},
    data = [],
    dataOption = {},
    mode = MODE.PC,
  }) => {
    const { dataset, dimName } = genDataset(data, { dataOption });
    const series = genSeries(option.series, {
      type,
      mode,
      dataset,
      dimName,
      dataOption,
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
    const result = {
      type,
      name,
      ...pick(option, ['color']),
      title,
      legend,
      tooltip,
      backgroundColor,
      graphic,
      series,
      dataset: { source: dataset },
    };

    return result;
  };
}
