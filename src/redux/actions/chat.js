const {
  ADD_CONVERSES,
  ADD_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_CONVERSES_FAILED,
  CREATE_CONVERSES_REQUEST,
  CREATE_CONVERSES_SUCCESS,
  CREATE_CONVERSES_FAILED,
  UPDATE_CONVERSES_SUCCESS,
  SWITCH_CONVERSES,
  SEND_MSG,
  SEND_MSG_COMPLETED,
  UPDATE_SYSTEM_CARD_CHAT_DATA,
} = require('../constants');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const { checkUser } = require('../../utils/usercache');
const { hideProfileCard, switchMenuPannel } = require('./ui');

let switchToConverse = function switchToConverse(uuid) {
  return function(dispatch, getState) {
    dispatch(hideProfileCard());
    dispatch(switchMenuPannel(0));
    dispatch(switchConverse(uuid));
  }
}

let addConverse = function addConverse(payload) {
  // if(!payload.uuid) {
  //   console.error('[addConverse]payload need uuid', payload);
  //   return;
  // }
  return {type: ADD_CONVERSES, payload: payload}
}

let switchConverse = function switchConverse(uuid) {
  return {type: SWITCH_CONVERSES, converseUUID: uuid}
}

let addMsg = function addMsg(converseUUID, payload) {
  return (dispatch, getState) => {
    if(!(converseUUID && typeof converseUUID === 'string')) {
      console.error('[addMsg]add message need converseUUID:', converseUUID);
      return;
    }

    if(!getState().getIn(['chat', 'converses', converseUUID])) {
      // 会话不存在，则创建会话
      console.log(payload);
      if(!!payload.room) {
        // 群聊
        dispatch(createConverse(payload.room, 'group', false));
      }else {
        // 单聊
        dispatch(createConverse(payload.sender_uuid, 'user', false))
      }
    }

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
      room: payload.room || '',
      sender_uuid: info.get('uuid'),
      to_uuid: converseUUID,
      type: payload.type,
      message: payload.message,
      is_public: payload.is_public,
      date: new Date(),
      data: payload.data,
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
        // 用户聊天记录
        for (let item of list) {
          let convUUID = item.uuid;
          // 获取日志
          checkUser(uuid);
          checkUser(convUUID);
          api.emit('chat::getChatLog', {uuid1: uuid, uuid2: convUUID}, function(data) {
            if(data.result) {
              dispatch({type:UPDATE_CONVERSES_SUCCESS, payload: data.list, convUUID});
            }else {
              console.error('获取聊天记录失败:', data.msg);
            }
          })
        }
      }else {
        dispatch({type:GET_CONVERSES_FAILED, payload: data.msg});
      }
    })
  }
}
let createConverse = function createConverse(uuid, type, isSwitchToConv = true) {
  return function(dispatch, getState) {
    if(!!getState().getIn(['chat', 'converses', uuid])) {
      console.log('已存在该会话');
      if(isSwitchToConv) {
        dispatch(switchToConverse(uuid));
      }
      return;
    }
    dispatch({type: CREATE_CONVERSES_REQUEST});
    return api.emit('chat::createConverse', {uuid, type}, function(data) {
      console.log('chat::createConverse', data);
      if(data.result) {
        let conv = data.data;
        dispatch({type: CREATE_CONVERSES_SUCCESS, payload:conv});

        let uuid = getState().getIn(['user','info','uuid']);
        let convUUID = conv.uuid;
        if(isSwitchToConv) {
          dispatch(switchToConverse(convUUID));
        }
        // 获取日志
        checkUser(uuid);
        checkUser(convUUID);
        api.emit('chat::getChatLog', {uuid1: uuid, uuid2: convUUID}, function(data) {
          if(data.result) {
            let list = data.list;
            dispatch({type:UPDATE_CONVERSES_SUCCESS, payload: list, convUUID});
          }else {
            console.error('获取聊天记录失败:' + data.msg);
          }
        })
      }else {
        dispatch({type: CREATE_CONVERSES_FAILED, payload:data.msg});
      }
    })
  }
}

let updateSystemCardChatData = function(chatUUID, newData) {
  return function(dispatch, getState) {
    return api.emit('chat::updateSystemCardChatData', {chatUUID, newData}, function(data) {
      if(data.result) {
        dispatch({type:UPDATE_SYSTEM_CARD_CHAT_DATA, chatUUID, payload: data.log});
      }else {
        console.error(data.msg);
      }
    })
  }
}

exports.addConverse = addConverse;
exports.switchConverse = switchConverse;
exports.addMsg = addMsg;
exports.sendMsg = sendMsg;
exports.getConverses = getConverses;
exports.createConverse = createConverse;
exports.updateSystemCardChatData = updateSystemCardChatData;
