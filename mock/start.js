const child_process = require('child_process');
const path = require('path');

child_process.spawn(
  'node',
  [
    'mock/index.js'
  ],
  {
    stdio: 'inherit'
  }
);

child_process.spawn(
  'node',
  [
    'mock/nginx.js'
  ],
  {
    stdio: 'inherit'
  }
);

child_process.spawn(
  path.join(__dirname, '../node_modules/.bin/vue-cli-service'),
  [
    'serve',
    '--mode',
    'mock'
  ],
  {
    stdio: 'inherit'
  }
);
