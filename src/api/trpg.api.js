const io = require('socket.io-client');
const config = require('../../config/project.config.js');

let api = null;
const platformSocketParam = {
  jsonp: false
}
function API() {
  this.serverUrl = `${config.io.protocol}://${config.io.host}:${config.io.port}`;
  this.socket = io(this.serverUrl, platformSocketParam);
  this.emit = (event, data, cb) => {
    if(this.socket.disconnected) {
      this.socket.connect();
    }
    return this.socket.emit(event, data, cb);
  }
  this.on = this.socket.on.bind(this.socket);
}

function getApiInstance() {
  if(!api) {
    api = new API();
  }

  return api;
}

function bindEventFunc(store) {
  const { addMsg } = require('../redux/actions/chat');

  if(!(this instanceof API)) {
    throw new Error('bindEventFunc shound a API object class');
  }
  let socket = this;
  socket.on('chat::message', function(data) {
    let converseUUID = data.room || data.sender_uuid;
    store.dispatch(addMsg(converseUUID, data));
  });

  socket.on('connection', function(data) {
    console.log('连接成功');
  })
  socket.on('reconnect', function(data) {
    console.log('重连成功');
  })
  socket.on('disconnect', function(data) {
    console.log('断开连接');
  })
}

exports.bindEventFunc = bindEventFunc;
exports.getInstance = getApiInstance;
