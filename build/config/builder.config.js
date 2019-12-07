// electron-builder config
// see https://www.electron.build/configuration/configuration#configuration

const path = require('path');

module.exports = {
  appId: 'com.moonrailgun.com',
  buildResources: {
    buildResources: path.resolve(__dirname, '../'),
    output: path.resolve(__dirname, '../../dist'),
    app: path.resolve(__dirname, '../../dist'),
  },
};
