let currentHost = window.location.host.split(":")[0];

module.exports = {
  io: {
    protocol: 'ws',
    host: currentHost,
    port: '23256'
  }
}
