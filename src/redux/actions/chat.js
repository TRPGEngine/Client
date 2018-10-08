const {
  ADD_CONVERSES,
  ADD_MSG,
  UPDATE_MSG,
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
const { checkUser } = require('../../shared/utils/cacheHelper');
const { hideProfileCard, switchMenuPannel } = require('./ui');

let localIndex = 0;
let getLocalUUID = function getLocalUUID() {
  return 'local#' + localIndex++;
}

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

let updateConversesMsglist = function updateConversesMsglist(convUUID, list) {
  return function(dispatch, getState) {
    for(let item of list) {
      if(item.sender_uuid) {
        checkUser(item.sender_uuid);
      }
    }
    dispatch({type: UPDATE_CONVERSES_MSGLIST_SUCCESS, convUUID, payload: list});
  }
}

// 获取多人会话
let getConverses = function getConverses(cb) {
  return function(dispatch, getState) {
    dispatch({type: GET_CONVERSES_REQUEST});
    // 获取会话列表
    return api.emit('chat::getConverses', {}, function(data) {
      cb && cb();
      if(data.result) {
        let list = data.list;
        dispatch({type:GET_CONVERSES_SUCCESS, payload: list});
        let uuid = getState().getIn(['user','info','uuid']);
        checkUser(uuid);
        // 用户聊天记录
        for (let item of list) {
          let convUUID = item.uuid;
          // 获取日志
          if(!/^trpg/.test(convUUID)) {
            checkUser(convUUID);
          }

          // TODO
          api.emit('chat::getConverseChatLog', {converse_uuid: convUUID}, function(data) {
            if(data.result) {
              dispatch(updateConversesMsglist(convUUID, data.list));
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

// 弃用
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
            dispatch(updateConversesMsglist(convUUID, list));
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
    if(typeof senders === 'string') {
      senders = [senders];
    }
    dispatch({
      type: GET_USER_CONVERSES_SUCCESS,
      payload: senders
        .map(uuid => ({uuid, type:'user'}))
        .concat([{uuid: 'trpgsystem', type: 'system', name: '系统消息'}])
    })

    // 用户会话缓存
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
            // icon: info.avatar,
          }})
        }else {
          console.error('更新用户会话信息时出错:', data, '| uuid:', uuid);
        }
      })

      // 更新消息列表
      api.emit('chat::getUserChatLog', {user_uuid: uuid}, function(data) {
        if(data.result) {
          let list = data.list;
          dispatch(updateConversesMsglist(uuid, list))
        }else {
          console.error('获取聊天记录失败:' + data.msg);
        }
      })
    }

    // 更新系统消息
    api.emit('chat::getUserChatLog', {user_uuid: 'trpgsystem'}, function(data) {
      if(data.result) {
        let list = data.list;
        dispatch(updateConversesMsglist('trpgsystem', list))
      }else {
        console.error('获取聊天记录失败:' + data.msg);
      }
    })
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

// 重新加载会话列表
// TODO: 暂时先把cb放在getConverses，以后再想办法优化
let reloadConverseList = function reloadConverseList(cb) {
  return function(dispatch, getState) {
    let userInfo = getState().getIn(['user', 'info']);
    let userUUID = userInfo.get('uuid');

    dispatch(getConverses(cb))
    rnStorage.get('userConverses#'+userUUID)
      .then(function(converse) {
        console.log('缓存中的用户会话列表:', converse);
        if(converse && converse.length > 0) {
          dispatch(addUserConverse(converse));
          dispatch(getOfflineUserConverse(userInfo.get('last_login')))
        }else {
          dispatch(getAllUserConverse())
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
      console.log('创建会话', payload);
      // if(!!payload.is_group) {
      //   // 群聊
      //   dispatch(createConverse(payload.room, 'group', false));
      // }else {
      //   // 单聊
      //   dispatch(createConverse(payload.sender_uuid, 'user', false))
      // }

      if(!payload.is_group) {
        // 单聊
        dispatch(addConverse({uuid: converseUUID, type:'user'}))
      }
    }

    checkUser(payload.sender_uuid); // 检查用户信息，保证每一条信息都能有信息来源

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
    const localUUID = getLocalUUID();
    let pkg = {
      room: payload.room || '',
      sender_uuid: info.get('uuid'),
      to_uuid: toUUID,
      converse_uuid: payload.converse_uuid,
      type: payload.type,
      message: payload.message,
      is_public: payload.is_public,
      is_group: payload.is_group,
      date: new Date().toISOString(),
      data: payload.data,
      uuid: localUUID,
    };
    console.log('send msg pkg:', pkg);

    dispatch(addMsg(payload.converse_uuid || toUUID, pkg));
    return api.emit('chat::message', pkg, function(data) {
      // console.log(data);
      // TODO: 待实现SEND_MSG_COMPLETED的数据处理方法(用于送达提示)
      dispatch({type:SEND_MSG_COMPLETED, payload: data, localUUID});
      if(data.result) {
        console.log('发送成功');
      }else {
        console.log('发送失败', pkg);
      }
    })
  }
}
let updateMsg = function updateMsg(converseUUID, payload) {
  console.log('try to update message', converseUUID, payload);
  return {
    type: UPDATE_MSG,
    converseUUID,
    msgUUID: payload.uuid,
    payload,
  }
}

let getMoreChatLog = function getMoreChatLog(converseUUID, offsetDate, isUserChat = true) {
  return function(dispatch, getState) {
    if(isUserChat) {
      api.emit('chat::getUserChatLog', {user_uuid: converseUUID, offsetDate}, function(data) {
        if(data.result === true) {
          dispatch(updateConversesMsglist(converseUUID, data.list))
        }else {
          console.log(data);
        }
      })
    }else {
      api.emit('chat::getConverseChatLog', {converse_uuid: converseUUID, offsetDate}, function(data) {
        if(data.result === true) {
          dispatch(updateConversesMsglist(converseUUID, data.list))
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

exports.switchToConverse = switchToConverse;
exports.addConverse = addConverse;
exports.updateConversesMsglist = updateConversesMsglist;
exports.switchConverse = switchConverse;
exports.getConverses = getConverses;
exports.createConverse = createConverse;
exports.removeConverse = removeConverse;
exports.addUserConverse = addUserConverse;
exports.getAllUserConverse = getAllUserConverse;
exports.getOfflineUserConverse = getOfflineUserConverse;
exports.reloadConverseList = reloadConverseList;
exports.addMsg = addMsg;
exports.sendMsg = sendMsg;
exports.updateMsg = updateMsg;
exports.getMoreChatLog = getMoreChatLog;
exports.updateCardChatData = updateCardChatData;
