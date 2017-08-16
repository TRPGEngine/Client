const io = require('socket.io-client');
const config = require('../../config/project.config.js')

let api = null;
let platformSocketParam = {
  jsonp: false
}
function API() {
  this.serverUrl = `${config.io.protocol}://${config.io.host}:${config.io.port}`;
  this.io = io(this.serverUrl, platformSocketParam);
  this.emit = this.io.emit;
  this.on = this.io.on;
}

function getApiInstance() {
  if(!api) {
    api = new API();
  }

  return api;
}

exports.bindEventFunc = bindEventFunc;
exports.getInstance = getApiInstance;

function bindEventFunc(store) {
  if(!(this instanceof API)) {
    throw new Error('bindEventFunc shound a API object class');
  }

  // console.log(this, store);
  // this.on('hello', function(data) {
  //   console.log(data);
  // });
}
