// electron-builder config
// see https://www.electron.build/configuration/configuration#configuration

const path = require('path');

module.exports = {
  appId: 'com.moonrailgun.trpg',
  productName: 'TRPG Engine Launcher',
  copyright: `Copyright © ${new Date().getFullYear()} moonrailgun`,
  // asar: false, // For debug
  directories: {
    buildResources: path.resolve(__dirname, '../electron/res/'),
    output: path.resolve(__dirname, '../../dist/launcher/'),
    app: path.resolve(__dirname, '../electron/'),
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  }
};
