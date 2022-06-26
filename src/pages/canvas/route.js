const config = {
  title: '画布',
  path: '/canvas/:id?',
  component: () => import(/* webpackChunkName: "canvas" */'./index'),
};

export default config;
