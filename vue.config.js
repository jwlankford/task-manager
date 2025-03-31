module.exports = {
  chainWebpack: (config) => {
    // Delete conflicting vue-loader rules
    config.module.rules.delete('vue');

    // Correctly reapply vue-loader for .vue files only
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end();

    // Ensure Babel handles .js files, excluding node_modules
    config.module
      .rule('js')
      .test(/\.js$/)
      .exclude.add(/node_modules/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .end();

    // For your project's CSS files
    config.module
      .rule('css')
      .test(/\.css$/)
      .exclude.add(/node_modules/) // Exclude node_modules here
      .end()
      .use('vue-style-loader')
      .loader('vue-style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader')
      .end()
      .use('postcss-loader')
      .loader('postcss-loader')
      .end();

    // Separate rule for handling CSS in node_modules
    config.module
      .rule('external-css')
      .test(/\.css$/)
      .include.add(/node_modules/) // Only process node_modules CSS here
      .end()
      .use('vue-style-loader')
      .loader('vue-style-loader')
      .end()
      .use('css-loader')
      .loader('css-loader') // No postcss-loader here
      .end();

    // Prevent vue-loader from processing `index.html`
    config.module.rule('html').exclude.add(/public\/index\.html/).end();
  },
};