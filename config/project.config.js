let environment = process.env.NODE_ENV || 'development';
let platform = process.env.PLATFORM || 'web';
let currentHost = '127.0.0.1';
if(!!window && window.location && window.location.host) {
  currentHost = window.location.host.split(":")[0];
}
if(environment=='production') {
  currentHost = 'trpgapi.moonrailgun.com';
}

let trpgHost = process.env.TRPG_HOST;
if(trpgHost) {
  currentHost = trpgHost;
}

let isSSL = location.protocol === 'https:';
let standardPort = isSSL ? '443' : '80';

module.exports = {
  version: require('../package.json').version,
  environment,
  platform,
  io: {
    protocol: isSSL ? 'wss' : 'ws',
    host: currentHost,
    port: environment === 'production' ? standardPort : '23256',
  },
  file: {
    protocol: isSSL ? 'https' : 'http',
    host: environment === 'production' ? currentHost + '/file' : currentHost,
    port: environment === 'production' ? standardPort : '23257',
  },
  defaultImg: {
    user: '/src/assets/img/gugugu1.png',
    group: '/src/assets/img/gugugu1.png',
    trpgsystem: '/src/assets/img/system_notice.png',
    actor: '',
  },
  github: {
    projectUrl: 'https://github.com/TRPGEngine/Client',
    projectPackageUrl: 'https://raw.githubusercontent.com/TRPGEngine/Client/master/package.json',
  },
  url: {
    goddessfantasy: 'http://www.goddessfantasy.net/',
    blog: 'http://moonrailgun.com',
  },
}
