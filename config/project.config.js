let environment = process.env.NODE_ENV || 'development';
let platform = process.env.PLATFORM || 'web';
let currentHost = '127.0.0.1';
let isSSL = false;
if(!!window && window.location && window.location.host) {
  currentHost = window.location.host.split(':')[0];
  isSSL = window.location.protocol === 'https:';
}
if(environment=='production') {
  currentHost = 'trpgapi.moonrailgun.com';
}

let trpgHost = process.env.TRPG_HOST;
if(trpgHost) {
  currentHost = trpgHost;
}

let standardPort = isSSL ? '443' : '80';

let out = {
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
    host: currentHost,
    port: environment === 'production' ? standardPort : '23256',
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
  defaultSettings: {
    user: {
      favoriteDice: [],
    },
    system: {
      notification: true,
    }
  },
}
out.file.url = `${out.file.protocol}://${out.file.host}:${out.file.port}`;
out.file.getAbsolutePath = function getAbsolutePath (path) {
  if(!path) {
    path = ''; // 设置默认值
  }
  if(path && path[0] === '/') {
    return out.file.url + path;
  }
  return path;
}

module.exports = out;
