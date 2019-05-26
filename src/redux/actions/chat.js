import constants from '../constants';
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
  REMOVE_USER_CONVERSE,
  UPDATE_CONVERSES_INFO_SUCCESS,
  UPDATE_CONVERSES_MSGLIST_SUCCESS,
  SWITCH_CONVERSES,
  SEND_MSG,
  SEND_MSG_COMPLETED,
  UPDATE_SYSTEM_CARD_CHAT_DATA,
  UPDATE_WRITING_STATUS,
} = constants;
import * as trpgApi from '../../api/trpg.api.js';
const api = trpgApi.getInstance();
import rnStorage from '../../api/rnStorage.api.js';
import { checkUser } from '../../shared/utils/cacheHelper';
import { hideProfileCard, switchMenuPannel } from './ui';
import * as uploadHelper from '../../shared/utils/uploadHelper';
import { renewableDelayTimer } from '../../shared/utils/timer';
import config from '../../../config/project.config';
import _without from 'lodash/without';

const getUserConversesHash = (userUUID) => {
  return `userConverses#${userUUID}`;
};

let localIndex = 0;
let getLocalUUID = function getLocalUUID() {
  return 'local#' + localIndex++;
};

export let switchConverse = function switchConverse(converseUUID, userUUID) {
  return { type: SWITCH_CONVERSES, converseUUID, userUUID };
};

export let switchToConverse = function switchToConverse(
  converseUUID,
  userUUID
) {
  return function(dispatch, getState) {
    dispatch(hideProfileCard());
    dispatch(switchMenuPannel(0));
    dispatch(switchConverse(converseUUID, userUUID));
  };
};

export let addConverse = function addConverse(payload) {
  // if(!payload.uuid) {
  //   console.error('[addConverse]payload need uuid', payload);
  //   return;
  // }
  return { type: ADD_CONVERSES, payload: payload };
};

export let updateConversesMsglist = function updateConversesMsglist(
  convUUID,
  list
) {
  return function(dispatch, getState) {
    for (let item of list) {
      if (item.sender_uuid) {
        checkUser(item.sender_uuid);
      }
    }
    dispatch({
      type: UPDATE_CONVERSES_MSGLIST_SUCCESS,
      convUUID,
      payload: list,
    });
  };
};

// 获取多人会话
export let getConverses = function getConverses(cb) {
  return function(dispatch, getState) {
    dispatch({ type: GET_CONVERSES_REQUEST });
    // 获取会话列表
    return api.emit('chat::getConverses', {}, function(data) {
      cb && cb();
      if (data.result) {
        let list = data.list;
        dispatch({ type: GET_CONVERSES_SUCCESS, payload: list });
        let uuid = getState().getIn(['user', 'info', 'uuid']);
        checkUser(uuid);
        // 用户聊天记录
        for (let item of list) {
          let convUUID = item.uuid;
          // 获取日志
          if (!/^trpg/.test(convUUID)) {
            checkUser(convUUID);
          }

          // TODO
          api.emit(
            'chat::getConverseChatLog',
            { converse_uuid: convUUID },
            function(data) {
              if (data.result) {
                dispatch(updateConversesMsglist(convUUID, data.list));
              } else {
                console.error('获取聊天记录失败:', data.msg);
              }
            }
          );
        }
      } else {
        console.error(data);
        dispatch({ type: GET_CONVERSES_FAILED, payload: data.msg });
      }
    });
  };
};

// 弃用
export let createConverse = function createConverse(
  uuid,
  type,
  isSwitchToConv = true
) {
  return function(dispatch, getState) {
    if (!!getState().getIn(['chat', 'converses', uuid])) {
      console.log('已存在该会话');
      if (isSwitchToConv) {
        dispatch(switchToConverse(uuid, uuid)); //TODO:CHECK
      }
      return;
    }
    dispatch({ type: CREATE_CONVERSES_REQUEST });
    return api.emit('chat::createConverse', { uuid, type }, function(data) {
      console.log('chat::createConverse', data);
      if (data.result) {
        let conv = data.data;
        dispatch({ type: CREATE_CONVERSES_SUCCESS, payload: conv });

        let convUUID = conv.uuid;
        if (isSwitchToConv) {
          dispatch(switchToConverse(convUUID, convUUID)); //TODO:CHECK
        }
        // 获取日志
        checkUser(uuid);
        api.emit(
          'chat::getConverseChatLog',
          { converse_uuid: convUUID },
          function(data) {
            if (data.result) {
              let list = data.list;
              dispatch(updateConversesMsglist(convUUID, list));
            } else {
              console.error('获取聊天记录失败:' + data.msg);
            }
          }
        );
      } else {
        dispatch({ type: CREATE_CONVERSES_FAILED, payload: data.msg });
      }
    });
  };
};

// 移除多人会话
export let removeConverse = function removeConverse(converseUUID) {
  return function(dispatch, getState) {
    return api.emit('chat::removeConverse', { converseUUID }, function(data) {
      if (data.result) {
        dispatch({ type: REMOVE_CONVERSES_SUCCESS, converseUUID });
      } else {
        console.error(data);
      }
    });
  };
};

export const removeUserConverse = (userConverseUUID) => {
  return (dispatch, getState) => {
    // 在当前删除
    dispatch({ type: REMOVE_USER_CONVERSE, converseUUID: userConverseUUID });

    // 在localStorage删除
    const userUUID = getState().getIn(['user', 'info', 'uuid']);
    const converses = getState().getIn(['chat', 'converses']);
    const uuids = Object.keys(
      converses.filter((c) => c.get('type') === 'user').toJS()
    );
    rnStorage.set(
      getUserConversesHash(userUUID),
      _without(uuids, userConverseUUID)
    );
  };
};

export let addUserConverse = function addUserConverse(senders) {
  return function(dispatch, getState) {
    if (typeof senders === 'string') {
      senders = [senders];
    }
    dispatch({
      type: GET_USER_CONVERSES_SUCCESS,
      payload: senders
        .map((uuid) => ({ uuid, type: 'user' }))
        .concat([{ uuid: 'trpgsystem', type: 'system', name: '系统消息' }]),
    });

    // 用户会话缓存
    let userUUID = getState().getIn(['user', 'info', 'uuid']);
    rnStorage.get(getUserConversesHash(userUUID)).then(function(converse) {
      converse = Array.from(new Set([...converse, ...senders]));
      rnStorage
        .set(getUserConversesHash(userUUID), converse)
        .then((data) => console.log('用户会话缓存完毕:', data));
    });

    for (let uuid of senders) {
      // 更新会话信息
      api.emit('player::getInfo', { type: 'user', uuid: uuid }, function(data) {
        if (data.result) {
          let info = data.info;
          dispatch({
            type: UPDATE_CONVERSES_INFO_SUCCESS,
            uuid: info.uuid,
            payload: {
              name: info.nickname || info.username,
              // icon: info.avatar,
            },
          });
        } else {
          console.error('更新用户会话信息时出错:', data, '| uuid:', uuid);
        }
      });

      // 更新消息列表
      api.emit('chat::getUserChatLog', { user_uuid: uuid }, function(data) {
        if (data.result) {
          let list = data.list;
          dispatch(updateConversesMsglist(uuid, list));
        } else {
          console.error('获取聊天记录失败:' + data.msg);
        }
      });
    }

    // 更新系统消息
    api.emit('chat::getUserChatLog', { user_uuid: 'trpgsystem' }, function(
      data
    ) {
      if (data.result) {
        let list = data.list;
        dispatch(updateConversesMsglist('trpgsystem', list));
      } else {
        console.error('获取聊天记录失败:' + data.msg);
      }
    });
  };
};

export let getOfflineUserConverse = function getOfflineUserConverse(
  lastLoginDate
) {
  return function(dispatch, getState) {
    api.emit('chat::getOfflineUserConverse', { lastLoginDate }, function(data) {
      if (data.result === true) {
        dispatch(addUserConverse(data.senders));
      } else {
        console.error(data);
      }
    });
  };
};

export let getAllUserConverse = function getAllUserConverse() {
  return function(dispatch, getState) {
    api.emit('chat::getAllUserConverse', {}, function(data) {
      if (data.result === true) {
        dispatch(addUserConverse(data.senders));
      } else {
        console.error(data);
      }
    });
  };
};

// 重新加载会话列表
// TODO: 暂时先把cb放在getConverses，以后再想办法优化
export let reloadConverseList = function reloadConverseList(cb) {
  return function(dispatch, getState) {
    let userInfo = getState().getIn(['user', 'info']);
    let userUUID = userInfo.get('uuid');

    dispatch(getConverses(cb)); // 从服务端获取多人会话列表
    rnStorage.get(getUserConversesHash(userUUID)).then(function(converse) {
      console.log('缓存中的用户会话列表:', converse);
      if (converse && converse.length > 0) {
        // 如果本地缓存有存在用户会话，则根据上次登录时间获取这段时间内新建的用户会话
        dispatch(addUserConverse(converse));
        dispatch(getOfflineUserConverse(userInfo.get('last_login')));
      } else {
        // 如果本地没有存在用户会话，则获取所有的用户会话
        dispatch(getAllUserConverse());
      }
    });
  };
};

export let addMsg = function addMsg(converseUUID, payload) {
  return (dispatch, getState) => {
    if (!(converseUUID && typeof converseUUID === 'string')) {
      console.error('[addMsg]add message need converseUUID:', converseUUID);
      return;
    }

    if (!getState().getIn(['chat', 'converses', converseUUID])) {
      // 会话不存在，则创建会话
      console.log('创建会话', payload);
      // if(!!payload.is_group) {
      //   // 群聊
      //   dispatch(createConverse(payload.room, 'group', false));
      // }else {
      //   // 单聊
      //   dispatch(createConverse(payload.sender_uuid, 'user', false))
      // }

      if (!payload.is_group) {
        // 单聊
        dispatch(addConverse({ uuid: converseUUID, type: 'user' }));
      }
    }

    checkUser(payload.sender_uuid); // 检查用户信息，保证每一条信息都能有信息来源

    let unread = true;
    if (
      converseUUID === getState().getIn(['chat', 'selectedConversesUUID']) ||
      converseUUID === getState().getIn(['group', 'selectedGroupUUID'])
    ) {
      unread = false;
    }

    // if(!!payload && !payload.uuid) {
    //   console.error('[addMsg]payload need uuid:', payload);
    //   return;
    // }
    dispatch({ type: ADD_MSG, converseUUID, unread, payload: payload });
  };
};

export let updateMsg = function updateMsg(converseUUID, payload) {
  console.log('try to update message', converseUUID, payload);
  return {
    type: UPDATE_MSG,
    converseUUID,
    msgUUID: payload.uuid,
    payload,
  };
};

export let sendMsg = function sendMsg(toUUID, payload) {
  return function(dispatch, getState) {
    dispatch({ type: SEND_MSG });
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

    let converseUUID = payload.converse_uuid || toUUID;
    dispatch(addMsg(converseUUID, pkg));
    return api.emit('chat::message', pkg, function(data) {
      // console.log(data);
      // TODO: 待实现SEND_MSG_COMPLETED的数据处理方法(用于送达提示)
      dispatch({
        type: SEND_MSG_COMPLETED,
        payload: data,
        localUUID,
        converseUUID,
      });
      if (data.result) {
        console.log('发送成功');
      } else {
        console.log('发送失败', pkg);
      }
    });
  };
};

export let sendFile = function sendFile(toUUID, payload, file) {
  if (!file) {
    console.error('发送文件错误。没有找到要发送的文件');
    return;
  }

  return function(dispatch, getState) {
    dispatch({ type: SEND_MSG });
    const info = getState().getIn(['user', 'info']);
    const selfUserUUID = info.get('uuid');
    const localUUID = getLocalUUID();
    let pkg = {
      room: payload.room || '',
      sender_uuid: selfUserUUID,
      to_uuid: toUUID,
      converse_uuid: payload.converse_uuid,
      type: 'file',
      message: payload.message || '[文件]',
      is_public: payload.is_public,
      is_group: payload.is_group,
      date: new Date().toISOString(),
      data: uploadHelper.generateFileMsgData(file),
      uuid: localUUID,
    };
    let converseUUID = payload.converse_uuid || toUUID;
    dispatch(addMsg(converseUUID, pkg));

    // 通过该方法发送的文件均为会话文件，存到临时文件夹
    uploadHelper.toTemporary(selfUserUUID, file, {
      onProgress: function(progress) {
        dispatch(
          updateMsg(payload.converse_uuid || toUUID, {
            uuid: pkg.uuid,
            data: Object.assign({}, pkg.data, { progress }),
          })
        );
      },
      onCompleted: function(fileinfo) {
        let filedata = Object.assign({}, pkg.data, fileinfo, { progress: 1 });
        pkg = Object.assign({}, pkg, { data: filedata });
        // 文件上传完毕。正式发送文件消息
        api.emit('chat::message', pkg, function(data) {
          dispatch({
            type: SEND_MSG_COMPLETED,
            payload: data,
            localUUID,
            converseUUID,
          });
          if (data.result) {
            console.log('发送成功');
          } else {
            console.log('发送失败', pkg);
          }
        });
      },
    });
  };
};

export let getMoreChatLog = function getMoreChatLog(
  converseUUID,
  offsetDate,
  isUserChat = true
) {
  return function(dispatch, getState) {
    if (isUserChat) {
      api.emit(
        'chat::getUserChatLog',
        { user_uuid: converseUUID, offsetDate },
        function(data) {
          if (data.result === true) {
            dispatch(updateConversesMsglist(converseUUID, data.list));
          } else {
            console.log(data);
          }
        }
      );
    } else {
      api.emit(
        'chat::getConverseChatLog',
        { converse_uuid: converseUUID, offsetDate },
        function(data) {
          if (data.result === true) {
            dispatch(updateConversesMsglist(converseUUID, data.list));
          } else {
            console.log(data);
          }
        }
      );
    }
  };
};

export let updateCardChatData = function(chatUUID, newData) {
  return function(dispatch, getState) {
    return api.emit('chat::updateCardChatData', { chatUUID, newData }, function(
      data
    ) {
      if (data.result) {
        dispatch({
          type: UPDATE_SYSTEM_CARD_CHAT_DATA,
          chatUUID,
          payload: data.log,
        });
      } else {
        console.error(data.msg);
      }
    });
  };
};

const getWriteHash = (type = 'user', uuid) => {
  return `${type}#${uuid}`;
};
export let startWriting = function(type = 'user', uuid) {
  return function(dispatch, getState) {
    dispatch({
      type: UPDATE_WRITING_STATUS,
      payload: {
        type,
        uuid,
        isWriting: true,
      },
    });

    renewableDelayTimer(
      getWriteHash(type, uuid),
      function() {
        dispatch(stopWriting()); // 如果10秒后没有再次收到正在输入的信号，则视为已经停止输入了
      },
      config.chat.isWriting.timeout
    );
  };
};
export let stopWriting = function(type = 'user', uuid) {
  return {
    type: UPDATE_WRITING_STATUS,
    payload: {
      type,
      uuid,
      isWriting: false,
    },
  };
};
