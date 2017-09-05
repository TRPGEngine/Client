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
  const { changeNetworkStatue } = require('../redux/actions/ui');

  if(!(this instanceof API)) {
    throw new Error('bindEventFunc shound a API object class');
  }
  let socket = this;
  socket.on('chat::message', function(data) {
    let converseUUID = data.room || data.sender_uuid;
    store.dispatch(addMsg(converseUUID, data));
  });

  socket.on('connect', function(data) {
    store.dispatch(changeNetworkStatue(true, '网络连接畅通'));
    console.log('连接成功');
  });
  socket.on('connecting', function(data) {
    store.dispatch(changeNetworkStatue(false, '正在连接...', true));
    console.log('正在连接');
  });
  socket.on('reconnect', function(data) {
    store.dispatch(changeNetworkStatue(true, '网络连接畅通'));
    console.log('重连成功');
  });
  socket.on('reconnecting', function(data) {
    store.dispatch(changeNetworkStatue(false, '正在连接...', true));
    console.log('重连中...');
  });
  socket.on('disconnect', function(data) {
    store.dispatch(changeNetworkStatue(false, '已断开连接'));
    console.log('已断开连接');
  });
  socket.on('connect_failed', function(data) {
    store.dispatch(changeNetworkStatue(false, '连接失败'));
    console.log('连接失败');
  });
  socket.on('error', function(data) {
    store.dispatch(changeNetworkStatue(false, '网络出现异常'));
    console.log('网络出现异常', data);
  });
}

exports.bindEventFunc = bindEventFunc;
exports.getInstance = getApiInstance;
