import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/zh-cn';
import App from './app.vue';
import router from './router';
import components from './components';

dayjs.locale('zh-cn');
dayjs.extend(updateLocale);
dayjs.updateLocale('zh-cn', {
  weekStart: 1,
});

const app = createApp(App);

const pinia = createPinia();
pinia.use((context = {}) => {
  const { store } = context;
  store.$router = markRaw(router);
});

app.use(pinia);
app.use(router);

Promise.all([
  import(/* webpackChunkName: "antd" */'ant-design-vue'),
  import(/* webpackChunkName: "grid-layout" */'vue-grid-layout-v3'),
]).then(([antd, gridLayout]) => {
  app.use(antd);
  app.use(gridLayout);
  app.use(components);

  const mountPoint = document.getElementById('app');
  app.mount(mountPoint);
});
