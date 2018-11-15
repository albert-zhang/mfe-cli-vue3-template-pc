
const localConfigs = require('./build/local-configs');
const devServerConfig = require('./build/dev-server-config');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  baseUrl: isProduction ? 'http://base-url-placeholder.com/' : '/',
  devServer: devServerConfig,
  chainWebpack: config => {
    // ref: https://github.com/mozilla-neutrino/webpack-chain
    config.plugin('html').tap(args => {
      args[0].localConfigs = localConfigs;
      return args;
    });
    if (process.env.ENABLE_BUNDLE_ANALYZER === '1') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(WebpackBundleAnalyzer.BundleAnalyzerPlugin);
    }
  },
};
