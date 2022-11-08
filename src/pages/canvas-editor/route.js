const config = {
  title: '画布',
  path: '/canvas-editor/:id?',
  component: () => import(/* webpackChunkName: "canvas-editor" */'./index'),
};

export default config;
