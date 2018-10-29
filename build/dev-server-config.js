const mockRoutes = require('../mock');

const devServerConfig = {
  disableHostCheck: true,
};

if (process.env.ENABLE_MOCK === '1') {
  devServerConfig.before = app => {
    app.use(mockRoutes);
  };
}

module.exports = devServerConfig;
