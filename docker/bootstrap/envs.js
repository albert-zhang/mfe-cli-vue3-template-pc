#!/usr/bin/env node

/**
 * 读取`.env`和`.env.production`，把里面的配置返回
 */

const path = require('path');
const fs = require('fs');

function convertEnvToObject(fp) {
  const toReturn = {};
  const fstr = fs.readFileSync(fp, {encoding: 'utf8'});
  fstr.split(/[\r\n]+/g).forEach(line => {
    const cmps = line.split(/\s*\=\s*/);
    if (cmps.length === 2) {
      toReturn[cmps[0]] = cmps[1];
    }
  });
  return toReturn;
}

function readEnvs() {
  const f1 = path.join(__dirname, '.env');
  const f2 = path.join(__dirname, '.env.production');
  const theVars = {};
  Object.assign(theVars, convertEnvToObject(f1));
  Object.assign(theVars, convertEnvToObject(f2));
  return theVars;
}

module.exports = readEnvs();
