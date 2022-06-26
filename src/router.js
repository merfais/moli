import {
  createRouter,
  createWebHistory,
} from 'vue-router';
import {
  map,
  omit,
} from 'lodash-es';
import canvas from '@/pages/canvas/route';

const config = {
  canvas,
  notFound: {
    title: '',
    path: '/:pathMatch(.*)*',
    redirect: '/canvas',
  },
};

function genRoutesConf(rawConfig) {
  return map(rawConfig, (item, name) => {
    const conf = omit(item, ['children', 'title', 'icon']);
    if (item.children) {
      conf.children = genRoutesConf(item.children);
    }
    conf.name = name;
    return conf;
  });
}

const router = createRouter({
  history: createWebHistory('/'),
  routes: genRoutesConf(config),
});

export default router;
