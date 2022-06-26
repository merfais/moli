export const data1 = {
  dimName: { name: '学历', value: '人数' },
  list: [
    { name: '本科', value: 335 },
    { name: '专科', value: 310 },
    { name: '硕士', value: 274 },
    { name: '高中', value: 235 },
    { name: '博士', value: 400 },
  ],
};

export const data2 = {
  dimName: { name: '学历', value: '人数', score: '分数' },
  list: [
    { name: '本科', value: 335, score: 111 },
    { name: '专科', value: 310, score: 222 },
    { name: '硕士', value: 274, score: 333 },
    { name: '高中', value: 235, score: 444 },
    { name: '博士', value: 400, score: 555 },
  ],
};

export default function getData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data2), 300);
  });
}
