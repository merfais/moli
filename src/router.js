import {
  createRouter,
  createWebHistory,
} from 'vue-router';
import {
  map,
  omit,
  upperFirst,
} from 'lodash-es';
import canvasEditor from '@/pages/canvas-editor/route';

const config = {
  canvasEditor,
  notFound: {
    title: '',
    path: '/:pathMatch(.*)*',
    redirect: '/canvas-editor',
  },
};

function genRoutesConf(rawConfig, pName = '') {
  return map(rawConfig, (item, name) => {
    const conf = omit(item, ['children', 'title', 'icon']);
    if (item.children) {
      conf.children = genRoutesConf(item.children, name);
    }
    conf.name = pName ? `${pName}${upperFirst(name)}` : name;
    return conf;
  });
}

const router = createRouter({
  history: createWebHistory('/'),
  routes: genRoutesConf(config),
});

export default router;
