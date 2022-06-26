import {
  get,
  forEach,
} from 'lodash-es';

export default function genDataset(data = [], { dataOption } = {}) {
  if (Array.isArray(data)) {
    // data = [
    //   ['学历', '人数'],
    //   ['本科', 335 ],
    //   ['专科', 310 ],
    //   ['硕士', 274 ],
    //   ['高中', 235 ],
    //   ['博士', 400 ],
    // ]
    if (Array.isArray(get(data, [0]))) {
      const [dimName, ...dataset] = data;
      return { dimName, dataset };
    }

    // data = [
    //   { name: '本科', value: 335 },
    //   { name: '专科', value: 310 },
    //   { name: '硕士', value: 274 },
    //   { name: '高中', value: 235 },
    //   { name: '博士', value: 400 },
    // ]
    let { dimName } = dataOption;
    // dimName 不存在，以数据的key构造dimName
    if (!dimName) {
      dimName = {};
      const keys = Object.keys(get(data, [0], {}));
      forEach(keys, (key) => dimName[key] = key);
    }
    return { dimName, dataset: data };
  }

  // data = {
  //   dimName: { name: '学历', value: '人数' },
  //   list: [
  //     { name: '本科', value: 335 },
  //     { name: '专科', value: 310 },
  //     { name: '硕士', value: 274 },
  //     { name: '高中', value: 235 },
  //     { name: '博士', value: 400 },
  //   ],
  // };
  const dimName = dataOption.dimName || data.dimName || {};
  const dataset = data.data || data.list || [];
  return { dimName, dataset };
}
