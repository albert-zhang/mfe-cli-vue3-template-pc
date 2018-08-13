const fs = require('fs');
const path = require('path');

function build() {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    return '';
  }
  let toReturn = `\nwindow.servicePrefix = {}\n`;
  const allServiceRequired = process.env.SERVICES_REQUIRED.split(/\s*,\s*/);
  allServiceRequired.forEach(service => {
    const v = process.env[`LOCAL_SERVICE_PREFIX_${service}`];
    toReturn += `window.servicePrefix['${service}'] = '${v}';\n`;
  });
  return toReturn;
}

module.exports = build();
