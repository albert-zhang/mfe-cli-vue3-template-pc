const path = require('path');
const jsonServer = require('json-server')

const abc = jsonServer.router(path.join(__dirname, 'data/abc.json'));
const def = jsonServer.router(path.join(__dirname, 'data/def.json'));

// the path must match with .env.mock
module.exports = {
  '/abc': abc,
  '/def': def,
};
