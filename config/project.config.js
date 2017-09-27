let currentHost = window.location.host.split(":")[0];
if(process.env.NODE_ENV=='production') {
  currentHost = 'trpgapi.moonrailgun.com';
}

module.exports = {
  io: {
    protocol: 'ws',
    host: currentHost,
    port: '23256'
  }
}
