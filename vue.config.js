const { defineConfig } = require('@vue/cli-service');
const path = require('path');

const devServer = {
  host: '0.0.0.0',
  port: 8080,
  allowedHosts: 'all',
  proxy: {
  },
};

const chainWebpack = (config) => {
  config.resolve.alias
    .set('@', path.resolve(__dirname, 'src'));

  // 关闭 sourceMap 生成
  config.devtool(false);

  // 关闭压缩
  if (process.env.NODE_ENV !== 'development') {
    config.plugin('html-index')
      .tap(([params]) => {
        Object.assign(params, { minify: false });
        return [params];
      });

    config.optimization
      .minimizer('terser')
      .tap(([params]) => {
        Object.assign(params.terserOptions, {
          compress: false,
        });
        return [params];
      });
    config.optimization
      .minimize(false)
      .splitChunks({});
  }

  // svg
  const svgRule = config.module.rule('svg');
  svgRule.uses.clear();
  svgRule.delete('type');
  svgRule.delete('generator');
  svgRule
    .use('vue-loader')
    .loader('vue-loader')
    .end()
    .use('vue-svg-loader')
    .loader('vue-svg-loader');

  if (process.argv.indexOf('--analyzer') !== -1) {
    config.plugin('analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  } else {
    config.plugins.delete('analyzer');
  }
};

const pages = {
  index: {
    // page 的入口
    entry: 'src/main.js',
    // 模板来源
    // template: 'index.html',
    // 在 dist/index.html 的输出
    // filename: 'index.html',
    // 当使用 title 选项时，
    // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    title: '茉莉',
    // 在这个页面中包含的块，默认情况下会包含
    // 提取出来的通用 chunk 和 vendor chunk。
    // chunks: ['chunk-vendors', 'chunk-common', 'index'],
  },
};

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  pages,
  devServer,
  chainWebpack,
  runtimeCompiler: true,
});
