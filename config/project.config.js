let environment = process.env.NODE_ENV || 'development';
let platform = process.env.PLATFORM || 'web';
let currentHost = '127.0.0.1';
if(!!window && window.location && window.location.host) {
  currentHost = window.location.host.split(":")[0];
}
if(environment=='production') {
  currentHost = 'trpgapi.moonrailgun.com';
}

module.exports = {
  version: require('../package.json').version,
  environment,
  platform,
  io: {
    protocol: 'ws',
    host: currentHost,
    port: '23256',
  },
  file: {
    protocol: 'http',
    host: currentHost,
    port: '23257',
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
