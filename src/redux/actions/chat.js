const {
  ADD_CONVERSES,
  ADD_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_CONVERSES_FAILED
} = require('../constants');
const immutable = require('immutable');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();

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
exports.getConverses = function() {
  return function(dispatch, getState) {
    dispatch({type:GET_CONVERSES_REQUEST});
    return api.emit('chat::getConverses', {}, function(data) {
      if(data.result) {
        let list = data.list;
        dispatch({type:GET_CONVERSES_SUCCESS, payload: list});
        console.log(list);
      }else {
        dispatch({type:GET_CONVERSES_FAILED, payload: data.msg});
      }
    })
  }
}
