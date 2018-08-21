const fs = require('fs');
const path = require('path');

function build() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return '';
  }
  let toReturn = `\nwindow.configs = {`;
  Object.keys(process.env).forEach(k => {
    if (k.startsWith('service_prefix.')) {
      toReturn += `${k}: ${process.env[k]},`;
    }
  });
  toReturn += '};';
  return toReturn;
}

module.exports = build();
