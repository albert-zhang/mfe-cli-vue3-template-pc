const jsonServer = require('json-server');
const routerCfg = require('./router');

function run() {
  const server = jsonServer.create();
  const middlewares = jsonServer.defaults();
  server.use(middlewares);
  Object.keys(routerCfg).forEach(path => {
    server.use(path, routerCfg[path]);
  });
  const port = 9091;
  server.listen(port, () => {
    console.log(`\nmock server listening on port ${port} ......\n`);
  });
}

run();
