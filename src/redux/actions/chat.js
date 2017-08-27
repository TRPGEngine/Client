const {
  ADD_CONVERSES,
  ADD_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_CONVERSES_FAILED,
  UPDATE_CONVERSES,
  SEND_MSG,
  SEND_MSG_COMPLETED
} = require('../constants');
const immutable = require('immutable');
const moment = require('moment');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const {checkUser} = require('../../utils/usercache');

let addConverse = function addConverse(payload) {
  // if(!payload.uuid) {
  //   console.error('[addConverse]payload need uuid', payload);
  //   return;
  // }
  return {type: ADD_CONVERSES, payload: payload}
}

let addMsg = function addMsg(converseUUID, payload) {
  return (dispatch, getState) => {
    if(!(converseUUID && typeof converseUUID === 'string')) {
      console.error('[addMsg]add message need converseUUID:', converseUUID);
      return;
    }

    // if(!!getState().getIn(['chat', 'converses', converseUUID])) {
    //
    // }
    
    // if(!!payload && !payload.uuid) {
    //   console.error('[addMsg]payload need uuid:', payload);
    //   return;
    // }
    dispatch({type: ADD_MSG, converseUUID, payload: payload});
  }
}
let sendMsg = function sendMsg(converseUUID, payload) {
  return function(dispatch, getState) {
    dispatch({type:SEND_MSG});
    const info = getState().getIn(['user', 'info']);
    let pkg = {
      room: '',
      sender_uuid: info.get('uuid'),
      to_uuid: converseUUID,
      type: payload.type,
      message: payload.message,
      is_public: payload.is_public,
      date: moment().valueOf(),
    };
    dispatch(addMsg(converseUUID, pkg))
    return api.emit('chat::message', pkg, function(data) {
      // console.log(data);
      dispatch({type:SEND_MSG_COMPLETED, payload: data});
      if(data.result) {
        console.log('发送成功');
      }else {
        console.log('发送失败', pkg);
      }
    })
  }
}
let getConverses = function getConverses() {
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
          checkUser(uuid);
          checkUser(convUUID);
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

exports.addConverse = addConverse;
exports.addMsg = addMsg;
exports.sendMsg = sendMsg;
exports.getConverses = getConverses;
