const { ADD_CONVERSES, ADD_MSG } = require('../constants');
const immutable = require('immutable');

function createConverse(dat) {
  return immutable.fromJS({
    uuid: dat.uuid || '',
    name: dat.name || '',
    icon: dat.icon || '',
    lastMsg: dat.lastMsg || '',
    lastTime: dat.lastTime || '',
    msgList: dat.msgList || []
  })
}
function createMsg(dat) {
  return immutable.fromJS({
    uuid: dat.uuid || '',
    sender: dat.sender || '',
    time: dat.time || '',
    content: dat.content || '',
  })
}

exports.addConverse = function(payload) {
  if(!payload.uuid) {
    console.error('[addConverse]payload need uuid', payload);
    return;
  }
  return {type: ADD_CONVERSES, payload: createConverse(payload)}
}
exports.addMsg = function(converseUUID, payload) {
  if(!(converseUUID && typeof converseUUID === 'string')) {
    console.error('[addMsg]add message need converseUUID:', converseUUID);
    return;
  }
  if(!!payload && !payload.uuid) {
    console.error('[addMsg]payload need uuid:', payload);
    return;
  }
  return {type: ADD_MSG, converseUUID, payload: createMsg(payload)}
}
