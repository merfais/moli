## 指引


### dataOption 数据结构

```typescript
const dataOption = {
  dimName: { [fieldId]: string },   // 每个维度的外显名字
  xAxis: [fieldId:string],     // x轴使用哪个维度，默认第1个维度
  yAxis: string[],      // y轴使用哪个维度，默认从第2个维度依次使用
  value: string,      // 饼图，值使用哪个维度
  name: string,       // 饼图，名字使用哪个维度
}
```

### dataset 数据结构

+ 二维数据
```javascript
// if (Array.isArray(get(data, [0]))) {
//   const [dimName, ...dataset] = data;
//   return { dimName, dataset };
// }
const data = [
  ['学历', '人数'],     // 第1行是dimName
  ['本科', 335 ],
  ['专科', 310 ],
  ['硕士', 274 ],
  ['高中', 235 ],
  ['博士', 400 ],
]
```

+ 对象数据

```javascript
// let { dimName } = dataOption;
// // dimName 不存在，以数据的key构造dimName
// if (!dimName) {
//   dimName = {};
//   const keys = Object.keys(get(data, [0], {}));
//   forEach(keys, key => dimName[key] = key);
// }
const data = [
  { name: '本科', value: 335 },
  { name: '专科', value: 310 },
  { name: '硕士', value: 274 },
  { name: '高中', value: 235 },
  { name: '博士', value: 400 },
]
```
+ 对象

```javascript
const data = {
  dimName: { name: '学历', value: '人数' },
  list: [
    { name: '本科', value: 335 },
    { name: '专科', value: 310 },
    { name: '硕士', value: 274 },
    { name: '高中', value: 235 },
    { name: '博士', value: 400 },
  ],
};
```
