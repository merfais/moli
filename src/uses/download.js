import dayjs from 'dayjs';

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
