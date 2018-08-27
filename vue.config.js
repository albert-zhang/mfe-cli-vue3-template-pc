
const localConfigs = require('./build/local-configs');
const devServerConfig = require('./build/dev-server-config');

module.exports = {
  devServer: devServerConfig,
  chainWebpack: config => {
    // ref: https://github.com/mozilla-neutrino/webpack-chain
    config.plugin('html').tap(args => {
      args[0].localConfigs = localConfigs;
      return args;
    });
  },
};
