const path = require('path');
const nginx = require('@mydreamplus/run-nginx');
const loadEnv = require('@vue/cli-service/lib/util/loadEnv');

function readProxyPassLocations() {
  const devEnvs = loadEnv(path.join(__dirname, '../.env.development'));
  const mockEnvs = loadEnv(path.join(__dirname, '../.env.mock'));

  const locations = {}; // source -> [target protocol, target host, target path] for proxy_pass

  Object.keys(mockEnvs).forEach(mockK => {
    if (mockK.startsWith('service_prefix.')) {
      const mockV = mockEnvs[mockK];
      const urlPath = mockV.replace('http://localhost:9090', '');
      const devServer = devEnvs[mockK];
      if (devServer){
        const devServerReg = /(https?:)?(\/\/)?([^\/]+)(\/)?(.*)/;
        const cmps = devServerReg.exec(devServer);
        const protocol = `${cmps[1] || 'http:'}//`;
        const host = cmps[3];
        const path = cmps[4] ? `/${cmps[5]}` : '/';
        locations[urlPath] = {
          protocol,
          host,
          path,
        };
      }
    }
  });

  return locations;
}

function generateNginxLocationDirectives() {
  const directives = [];
  locations = readProxyPassLocations();
  Object.keys(locations).forEach(location => {
    const nameFor404 = '404_' + Date.now(0) + Math.floor(Math.random() * 1000);
    const devServer = locations[location];
    const cfgStr = `
location @${nameFor404} {
  rewrite ^ ${devServer.path} break;
  proxy_pass ${devServer.protocol}${devServer.host};
}
location ${location} {
  proxy_pass http://localhost:9091${location};
  proxy_intercept_errors on;
  error_page 404 = @${nameFor404};
}
    `;
    directives.push(cfgStr);
  });
  return directives;
}

function run() {
  const directives = generateNginxLocationDirectives();
  const server = `
server {
  listen 9090;
  server_name localhost;
  ${directives.join('\n')}
}
  `;

  nginx.start(server);
}

run();
