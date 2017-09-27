// let currentHost = window.location.host.split(":")[0];
let currentHost = 'trpgapi.moonrailgun.com';

module.exports = {
  io: {
    protocol: 'ws',
    host: currentHost,
    port: '23256'
  }
}
