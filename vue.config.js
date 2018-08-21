
const localScript = require('./build/local-script');
const devServerConfig = require('./build/dev-server-config');

module.exports = {
  devServer: devServerConfig,
  chainWebpack: config => {
    // ref: https://github.com/mozilla-neutrino/webpack-chain
    config.plugin('html').tap(args => {
      args[0].localScript = localScript;
      return args;
    });
  },
};
