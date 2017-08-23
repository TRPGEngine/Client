const {
  ADD_CONVERSES,
  ADD_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_CONVERSES_FAILED,
  UPDATE_CONVERSES
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
    // 获取会话列表
    return api.emit('chat::getConverses', {}, function(data) {
      if(data.result) {
        let list = data.list;
        dispatch({type:GET_CONVERSES_SUCCESS, payload: list});
        let uuid = getState().getIn(['user','info','uuid']);
        for (let item of list) {
          let convUUID = item.uuid;
          // 获取日志
          api.emit('chat::getChatLog', {uuid1: uuid, uuid2: convUUID}, function(data) {
            if(data.result) {
              let list = data.list;
              dispatch({type:UPDATE_CONVERSES, payload: list, convUUID});
            }else {
              console.error('获取聊天记录失败:' + data.msg);
            }
          })
        }
      }else {
        dispatch({type:GET_CONVERSES_FAILED, payload: data.msg});
      }
    })
  }
}
