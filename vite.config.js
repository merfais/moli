/* eslint-disable import/no-extraneous-dependencies */
import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: '',
  plugins: [
    vue(),
    vueJsx(),
    svgLoader(),
    eslintPlugin({
      eslintOptions: {
        cache: true,
        cacheLocation: './node_modules/.cache/.eslintcache',
      },
      shouldLint: (pathStr) => {
        if (/node_modules/.test(pathStr)) {
          return false;
        }
        return /\.(vue|m?[jt]sx?)$/.test(pathStr);
      },
      formatter: 'stylish',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    host: '0.0.0.0',
    port: 30111,
    proxy: {
    },
  },
}));
