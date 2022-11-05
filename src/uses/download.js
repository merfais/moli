import dayjs from 'dayjs';
import {
  map,
  get,
  forEach,
} from 'lodash-es';

export function downloadTableData(options = {}) {
  const { name } = options;
  const csvData = genCsvData(options);
  useDownloadCSV(csvData, name);
}

export function genCsvData(options = {}) {
  const { columns, dataSource } = options;
  const titleArr = [];
  forEach(columns, (colItem = {}) => {
    if (colItem.notVisible) {
      return;
    }
    const { name, title } = colItem;
    titleArr.push(name || title);
  });
  const data = map(dataSource, (docItem) => {
    const row = [];
    forEach(columns, (colItem) => {
      if (colItem.notVisible) {
        return;
      }
      const { metaIndex, dataIndex } = colItem;
      const idx = metaIndex === undefined ? dataIndex : metaIndex;
      const value = get(docItem, idx);
      let text = formatCsvCell({ value, colItem });
      // excel 打开 csv，纯数字超过15位后面都会被转成0，
      // 当 >= 16位纯数字时，添加制表位
      if (/^\d{16,}$/.test(text)) {
        text += '\t';
      }
      row.push(text);
    });
    return row.join();
  });
  const csvData = [titleArr.join()].concat(data);
  return csvData;
}

export function formatCsvCell(options = {}) {
  const { value, colItem = {} } = options;
  const { valueType } = colItem;
  // 替换字符串中的换行，tab，逗号字符
  if (typeof value === 'string' || (valueType === 'string' && value)) {
    return String(value).replace(/\s|,/g, ' ');
  }
  // 值是数组，且不展开成多行，则用空格join一下，避免csv格式错误
  if (Array.isArray(value)) {
    return value.join(' ');
  }
  return value;
}

export function useDownloadCSV(csvData, name) {
  const blob = new Blob([`\uFEFF${csvData.join('\r\n')}`], {
    type: 'text/plain;charset=utrf-8',
  });
  const a = document.createElement('a');
  a.setAttribute('href', URL.createObjectURL(blob));
  const date = dayjs().format('YYYYMMDD_HHmmss_SSS');
  a.setAttribute('download', `${name}_${date}.csv`);
  a.click();
}
