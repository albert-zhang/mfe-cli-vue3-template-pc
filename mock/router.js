const path = require('path');
const jsonServer = require('json-server')

const example = jsonServer.router(path.join(__dirname, 'data/example.json'));

// the path must match with .env.mock
module.exports = {
  '/example': example
};
