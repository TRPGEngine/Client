let currentHost = window.location.host.split(":")[0];
if(process.env.NODE_ENV=='production') {
  currentHost = 'trpgapi.moonrailgun.com';
}

module.exports = {
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
  },
}
