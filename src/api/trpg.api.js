const io = require('socket.io-client');
const config = require('../../config/project.config.js');

let api = null;
let platformSocketParam = {
  jsonp: false
}
function API() {
  this.serverUrl = `${config.io.protocol}://${config.io.host}:${config.io.port}`;
  this.io = io(this.serverUrl, platformSocketParam);
  this.emit = this.io.emit.bind(this.io);
  this.on = this.io.on.bind(this.io);
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
}

exports.bindEventFunc = bindEventFunc;
exports.getInstance = getApiInstance;
