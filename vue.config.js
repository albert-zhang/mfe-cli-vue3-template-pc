
const localConfigs = require('./build/local-configs');
const devServerConfig = require('./build/dev-server-config');

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
  },
};
