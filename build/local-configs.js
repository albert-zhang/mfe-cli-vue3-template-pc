const fs = require('fs');
const path = require('path');

/** 防止所有的process.env被写入到window.configs中 */
const includeKeyPatterns = [/service_prefix\./];

function build() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return '';
  }
  let toReturn = `\nwindow.configs = {`; // the 'configs' must match with the docker base image
  Object.keys(process.env).forEach(k => {
    const include = includeKeyPatterns.some(pt => {
      return pt.test(k);
    });
    if (include) {
      toReturn += `'${k}': '${process.env[k]}',`;
    }
  });
  toReturn += '};';
  return toReturn;
}

module.exports = build();
