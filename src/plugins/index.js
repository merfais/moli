export default async function addPlugin(app) {
  return Promise.all([
    import(/* webpackChunkName: "antv" */'./ant-design-vue'),
    import(/* webpackChunkName: "element-plus" */'./element-plus'),
    import(/* webpackChunkName: "grid-layout" */'./vue-grid-layout-v3'),
  ]).then((arr) => {
    arr.forEach(module => module.add(app));
  });
}
