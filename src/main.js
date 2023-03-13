import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import App from './app.vue';
import router from './router';
import components from './components';
import addPlugin from './plugins';

const app = createApp(App);

const pinia = createPinia();
pinia.use((context = {}) => {
  const { store } = context;
  store.$router = markRaw(router);
});

app.use(pinia);
app.use(router);

addPlugin(app).then(() => {
  app.use(components);

  const mountPoint = document.getElementById('app');
  app.mount(mountPoint);
});
