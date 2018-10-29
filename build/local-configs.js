const fs = require('fs');
const path = require('path');

function replaceSingleQuote(str) {
  return str.replace(/\'/g, '\\\'');
}

function build() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return '';
  }
  let toReturn = `\nwindow.configs = {`;
  Object.keys(process.env).forEach(k => {
    toReturn += `'${replaceSingleQuote(k)}': '${replaceSingleQuote(process.env[k])}',`;
  });
  toReturn += '};';
  return toReturn;
}

module.exports = build();
