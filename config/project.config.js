let currentHost = window.location.host ? window.location.host.split(":")[0] : '127.0.0.1';
if(process.env.NODE_ENV=='production') {
  currentHost = 'trpgapi.moonrailgun.com';
}

let platform = process.env.PLATFORM || 'web';

module.exports = {
  version: require('../package.json').version,
  platform,
  io: {
    protocol: 'ws',
    host: currentHost,
    port: '23256'
  },
  file: {
    protocol: 'http',
    host: currentHost,
    port: '23257'
  },
  defaultImg: {
    user: '/src/assets/img/gugugu1.png',
    group: '/src/assets/img/gugugu1.png',
    trpgsystem: '/src/assets/img/system_notice.png',
    actor: '',
  },
}
