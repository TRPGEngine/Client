const {
  ADD_CONVERSES,
  ADD_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_CONVERSES_FAILED,
  GET_USER_CONVERSES_SUCCESS,
  CREATE_CONVERSES_REQUEST,
  CREATE_CONVERSES_SUCCESS,
  CREATE_CONVERSES_FAILED,
  REMOVE_CONVERSES_SUCCESS,
  UPDATE_CONVERSES_INFO_SUCCESS,
  UPDATE_CONVERSES_MSGLIST_SUCCESS,
  SWITCH_CONVERSES,
  SEND_MSG,
  SEND_MSG_COMPLETED,
  UPDATE_SYSTEM_CARD_CHAT_DATA,
} = require('../constants');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const rnStorage = require('../../api/rnStorage.api.js');
const { checkUser } = require('../../utils/usercache');
const { hideProfileCard, switchMenuPannel } = require('./ui');


let switchConverse = function switchConverse(converseUUID, userUUID) {
  return {type: SWITCH_CONVERSES, converseUUID, userUUID}
}

let switchToConverse = function switchToConverse(converseUUID, userUUID) {
  return function(dispatch, getState) {
    dispatch(hideProfileCard());
    dispatch(switchMenuPannel(0));
    dispatch(switchConverse(converseUUID, userUUID));
  }
}

let addConverse = function addConverse(payload) {
  // if(!payload.uuid) {
  //   console.error('[addConverse]payload need uuid', payload);
  //   return;
  // }
  return {type: ADD_CONVERSES, payload: payload}
}

let getConverses = function getConverses(cb) {
  return function(dispatch, getState) {
    dispatch({type:GET_CONVERSES_REQUEST});
    // 获取会话列表
    return api.emit('chat::getConverses', {}, function(data) {
      cb && cb();
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
          api.emit('chat::getConverseChatLog', {converse_uuid: convUUID}, function(data) {
            if(data.result) {
              dispatch({type:UPDATE_CONVERSES_MSGLIST_SUCCESS, payload: data.list, convUUID});
            }else {
              console.error('获取聊天记录失败:', data.msg);
            }
          })
        }
      }else {
        console.error(data);
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
        dispatch(switchToConverse(uuid, uuid));//TODO:CHECK
      }
      return;
    }
    dispatch({type: CREATE_CONVERSES_REQUEST});
    return api.emit('chat::createConverse', {uuid, type}, function(data) {
      console.log('chat::createConverse', data);
      if(data.result) {
        let conv = data.data;
        dispatch({type: CREATE_CONVERSES_SUCCESS, payload:conv});

        let convUUID = conv.uuid;
        if(isSwitchToConv) {
          dispatch(switchToConverse(convUUID, convUUID));//TODO:CHECK
        }
        // 获取日志
        checkUser(uuid);
        api.emit('chat::getConverseChatLog', {converse_uuid: convUUID}, function(data) {
          if(data.result) {
            let list = data.list;
            dispatch({type:UPDATE_CONVERSES_MSGLIST_SUCCESS, payload: list, convUUID});
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
let removeConverse = function removeConverse(converseUUID) {
  return function(dispatch, getState) {
    return api.emit('chat::removeConverse', {converseUUID}, function(data) {
      if(data.result) {
        dispatch({type:REMOVE_CONVERSES_SUCCESS, converseUUID});
      }else {
        console.error(data);
      }
    })
  }
}

let addUserConverse = function addUserConverse(senders) {
  return function(dispatch, getState) {
    dispatch({type: GET_USER_CONVERSES_SUCCESS, payload: senders.map(uuid => ({uuid, type:'user'}))})

    // 用户信息缓存
    let userUUID = getState().getIn(['user', 'info', 'uuid']);
    rnStorage.get('userConverses#'+userUUID)
      .then(function(converse) {
        converse = Array.from(new Set([...converse, ...senders]))
        rnStorage.set('userConverses#'+userUUID, converse).then(data => console.log('用户会话缓存完毕:', data));
      })



    for (let uuid of senders) {
      // 更新会话信息
      api.emit('player::getInfo', {type: 'user', uuid: uuid}, function(data) {
        if(data.result) {
          let info = data.info;
          dispatch({type: UPDATE_CONVERSES_INFO_SUCCESS, uuid: info.uuid, payload: {
            name: info.nickname || info.username,
            icon: info.avatar,
          }})
        }else {
          console.error('更新用户会话信息时出错:', data);
        }
      })

      // 更新消息列表
      api.emit('chat::getUserChatLog', {user_uuid: uuid}, function(data) {
        if(data.result) {
          let list = data.list;
          dispatch({type:UPDATE_CONVERSES_MSGLIST_SUCCESS, payload: list, convUUID: uuid});
        }else {
          console.error('获取聊天记录失败:' + data.msg);
        }
      })
    }
  }
}

let getOfflineUserConverse = function getOfflineUserConverse(lastLoginDate) {
  return function(dispatch, getState) {
    api.emit('chat::getOfflineUserConverse', {lastLoginDate}, function(data) {
      if(data.result === true) {
        dispatch(addUserConverse(data.senders));
      }else {
        console.error(data);
      }
    })
  }
}

let getAllUserConverse = function getAllUserConverse() {
  return function(dispatch, getState) {
    api.emit('chat::getAllUserConverse', {}, function(data) {
      if(data.result === true) {
        dispatch(addUserConverse(data.senders));
      }else {
        console.error(data);
      }
    })
  }
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

    let unread = true;
    if(converseUUID === getState().getIn(['chat', 'selectedConversesUUID']) || converseUUID === getState().getIn(['group', 'selectedGroupUUID'])) {
      unread = false;
    }

    // if(!!payload && !payload.uuid) {
    //   console.error('[addMsg]payload need uuid:', payload);
    //   return;
    // }
    dispatch({type: ADD_MSG, converseUUID, unread, payload: payload});
  }
}
let sendMsg = function sendMsg(toUUID, payload) {
  return function(dispatch, getState) {
    dispatch({type:SEND_MSG});
    const info = getState().getIn(['user', 'info']);
    let pkg = {
      room: payload.room || '',
      sender_uuid: info.get('uuid'),
      to_uuid: toUUID,
      converse_uuid: payload.converse_uuid,
      type: payload.type,
      message: payload.message,
      is_public: payload.is_public,
      is_group: payload.is_group,
      date: new Date(),
      data: payload.data,
    };
    console.log('send msg pkg:', pkg);

    dispatch(addMsg(payload.converse_uuid || toUUID, pkg));
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

let getMoreChatLog = function getMoreChatLog(converseUUID, offsetDate, isUserChat = true) {
  return function(dispatch, getState) {
    if(isUserChat) {
      api.emit('chat::getUserChatLog', {user_uuid: converseUUID, offsetDate}, function(data) {
        if(data.result === true) {
          dispatch({type: UPDATE_CONVERSES_MSGLIST_SUCCESS, payload: data.list, convUUID: converseUUID});
        }else {
          console.log(data);
        }
      })
    }else {
      api.emit('chat::getConverseChatLog', {converse_uuid: converseUUID, offsetDate}, function(data) {
        if(data.result === true) {
          dispatch({type: UPDATE_CONVERSES_MSGLIST_SUCCESS, payload: data.list, convUUID: converseUUID});
        }else {
          console.log(data);
        }
      })
    }
  }
}

let updateCardChatData = function(chatUUID, newData) {
  return function(dispatch, getState) {
    return api.emit('chat::updateCardChatData', {chatUUID, newData}, function(data) {
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
exports.getConverses = getConverses;
exports.createConverse = createConverse;
exports.removeConverse = removeConverse;
exports.addUserConverse = addUserConverse;
exports.getAllUserConverse = getAllUserConverse;
exports.getOfflineUserConverse = getOfflineUserConverse;
exports.addMsg = addMsg;
exports.sendMsg = sendMsg;
exports.getMoreChatLog = getMoreChatLog;
exports.updateCardChatData = updateCardChatData;
