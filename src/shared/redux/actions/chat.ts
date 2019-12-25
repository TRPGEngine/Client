import constants from '../constants';
const {
  ADD_CONVERSES,
  ADD_MSG,
  UPDATE_MSG,
  REMOVE_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_USER_CONVERSES_SUCCESS,
  CREATE_CONVERSES_SUCCESS,
  CREATE_CONVERSES_FAILED,
  REMOVE_CONVERSES_SUCCESS,
  REMOVE_USER_CONVERSE,
  UPDATE_CONVERSES_INFO_SUCCESS,
  UPDATE_CONVERSES_MSGLIST_SUCCESS,
  SWITCH_CONVERSES,
  CLEAR_SELECTED_CONVERSE,
  SEND_MSG_COMPLETED,
  UPDATE_SYSTEM_CARD_CHAT_DATA,
  UPDATE_WRITING_STATUS,
  UPDATE_USER_CHAT_EMOTION_CATALOG,
  ADD_USER_CHAT_EMOTION_CATALOG,
  SET_CONVERSES_MSGLOG_NOMORE,
  SET_CONVERSE_ISREAD,
} = constants;
import * as trpgApi from '../../api/trpg.api';
const api = trpgApi.getInstance();
import rnStorage from '../../api/rn-storage.api';
import { checkUser } from '../../utils/cache-helper';
import { hideProfileCard, switchMenuPannel, showAlert } from './ui';
import * as uploadHelper from '../../utils/upload-helper';
import { renewableDelayTimer } from '../../utils/timer';
import config from '../../project.config';
import _without from 'lodash/without';
import _isFunction from 'lodash/isFunction';
import { MsgPayload, ConverseInfo } from '@src/shared/redux/types/chat';
import { TRPGAction } from '../types/__all__';
import { isUserUUID } from '@shared/utils/uuid';

const getUserConversesHash = (userUUID: string): string => {
  return `userConverses#${userUUID}`;
};

/**
 * 获取本地UUID
 */
let localIndex = 0;
let getLocalUUID = function getLocalUUID() {
  return 'local#' + localIndex++;
};

// 切换当前会话页面
export let switchConverse = function switchConverse(
  converseUUID: string
): TRPGAction {
  return { type: SWITCH_CONVERSES, converseUUID };
};

// 跳转到会话页面并切换到会话
export let switchToConverse = function switchToConverse(
  converseUUID: string
): TRPGAction {
  return function(dispatch, getState) {
    dispatch(hideProfileCard());
    dispatch(switchMenuPannel(0));
    dispatch(switchConverse(converseUUID));
  };
};

/**
 * 清理当前选择的会话
 */
export const clearSelectedConverse = function clearSelectedConverse(): TRPGAction {
  return { type: CLEAR_SELECTED_CONVERSE };
};

export let addConverse = function addConverse(payload): TRPGAction {
  // if(!payload.uuid) {
  //   console.error('[addConverse]payload need uuid', payload);
  //   return;
  // }
  return { type: ADD_CONVERSES, payload: payload };
};

export let updateConversesMsglist = function updateConversesMsglist(
  convUUID,
  list
): TRPGAction {
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
export let getConverses = function getConverses(cb?: () => void): TRPGAction {
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
      }
    });
  };
};

// 弃用
export let createConverse = function createConverse(
  uuid,
  type,
  isSwitchToConv = true
): TRPGAction {
  return function(dispatch, getState) {
    if (!!getState().getIn(['chat', 'converses', uuid])) {
      console.log('已存在该会话');
      if (isSwitchToConv) {
        dispatch(switchToConverse(uuid));
      }
      return;
    }
    return api.emit('chat::createConverse', { uuid, type }, function(data) {
      console.log('chat::createConverse', data);
      if (data.result) {
        let conv = data.data;
        dispatch({ type: CREATE_CONVERSES_SUCCESS, payload: conv });

        let convUUID = conv.uuid;
        if (isSwitchToConv) {
          dispatch(switchToConverse(convUUID));
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
export let removeConverse = function removeConverse(
  converseUUID: string
): TRPGAction {
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

export const removeUserConverse = (userConverseUUID: string): TRPGAction => {
  return (dispatch, getState) => {
    // 在当前删除
    dispatch({ type: REMOVE_USER_CONVERSE, converseUUID: userConverseUUID });

    // 在localStorage删除
    const userUUID = getState().getIn(['user', 'info', 'uuid']);
    const converses = getState().getIn(['chat', 'converses']);
    const uuids = Object.keys(
      converses.filter((c) => c.get('type') === 'user')
    );
    rnStorage.set(
      getUserConversesHash(userUUID),
      _without(uuids, userConverseUUID)
    );
  };
};

/**
 * 增加用户UUID会话列表
 * @param senders 会话UUID列表
 */
export let addUserConverse = function addUserConverse(
  senders: string[]
): TRPGAction {
  return function(dispatch, getState) {
    if (typeof senders === 'string') {
      senders = [senders];
    }

    dispatch({
      type: GET_USER_CONVERSES_SUCCESS,
      payload: senders
        .map<ConverseInfo>((uuid) => ({
          uuid,
          type: 'user',
        }))
        .concat([{ uuid: 'trpgsystem', type: 'system', name: '系统消息' }]),
    });

    // 用户会话缓存
    const userUUID = getState().getIn(['user', 'info', 'uuid']);
    rnStorage
      .get(getUserConversesHash(userUUID), [])
      .then(function(cachedConverse: string[]) {
        const allConverse: string[] = Array.from(
          new Set([...cachedConverse, ...senders])
        );
        rnStorage
          .set(getUserConversesHash(userUUID), allConverse)
          .then((data) => console.log('用户会话缓存完毕:', data));
      });

    for (let uuid of senders) {
      if (!isUserUUID(uuid)) {
        continue;
      }

      // 更新会话信息
      api.emit('player::getInfo', { type: 'user', uuid: uuid }, function(data) {
        if (data.result) {
          const info = data.info;
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
  lastLoginDate: string
): TRPGAction {
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

export let getAllUserConverse = function getAllUserConverse(): TRPGAction {
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
export let reloadConverseList = function reloadConverseList(
  cb?: () => void
): TRPGAction {
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

export let addMsg = function addMsg(converseUUID, payload): TRPGAction {
  return (dispatch, getState) => {
    if (!(converseUUID && typeof converseUUID === 'string')) {
      console.error('[addMsg]add message need converseUUID:', converseUUID);
      return;
    }

    if (!getState().getIn(['chat', 'converses', converseUUID])) {
      // 会话不存在，则创建会话
      console.log('创建会话', converseUUID, payload);
      // if(!!payload.is_group) {
      //   // 群聊
      //   dispatch(createConverse(payload.room, 'group', false));
      // }else {
      //   // 单聊
      //   dispatch(createConverse(payload.sender_uuid, 'user', false))
      // }

      if (!payload.is_group) {
        // 单聊
        // dispatch(addConverse({ uuid: converseUUID, type: 'user' }));
        dispatch(addUserConverse([converseUUID]));
      }
    }

    checkUser(payload.sender_uuid); // 检查用户信息，保证每一条信息都能有信息来源

    let unread = true;
    if (
      converseUUID === getState().getIn(['chat', 'selectedConverseUUID']) ||
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

export let updateMsg = function updateMsg(converseUUID, payload): TRPGAction {
  console.log('try to update message', converseUUID, payload);
  return {
    type: UPDATE_MSG,
    converseUUID,
    msgUUID: payload.uuid,
    payload,
  };
};

/**
 * 发送消息
 * @param toUUID 发送目标
 * @param payload 信息数据
 */
export let sendMsg = function sendMsg(
  toUUID: string,
  payload: MsgPayload
): TRPGAction {
  return function(dispatch, getState) {
    const info = getState().getIn(['user', 'info']);
    const localUUID = getLocalUUID();
    let pkg = {
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

export let sendFile = function sendFile(toUUID, payload, file): TRPGAction {
  if (!file) {
    console.error('发送文件错误。没有找到要发送的文件');
    return;
  }

  return function(dispatch, getState) {
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

/**
 * 添加一条假的本地消息。当外部满足一定条件后需要把这条消息删除
 * @param pkg 消息内容
 * @param callback 添加后的回调
 */
export const addFakeMsg = function addFakeMsg(
  pkg: MsgPayload,
  callback?: (localUUID: string) => void
): TRPGAction {
  return function(dispatch, getState) {
    const info = getState().getIn(['user', 'info']);
    const localUUID = getLocalUUID();
    pkg.uuid = localUUID;
    if (!pkg.sender_uuid) {
      pkg.sender_uuid = info.get('uuid');
    }
    if (!pkg.date) {
      pkg.date = new Date().toISOString();
    }
    const converseUUID = pkg.converse_uuid || pkg.to_uuid;
    dispatch(addMsg(converseUUID, pkg));
    _isFunction(callback) && callback(localUUID);
  };
};

/**
 * 移除假的本地消息
 * @param converseUUID 会话UUID
 * @param localUUID 假消息的UUID
 */
export const removeFakeMsg = function removeFakeMsg(
  converseUUID: string,
  localUUID: string
): TRPGAction {
  return {
    type: REMOVE_MSG,
    converseUUID,
    localUUID,
  };
};

/**
 * 增加一个处理中的msg
 * @param converseUUID 会话UUID
 */
interface LoadingCallbackEvent {
  updateProgress: (val: number) => void;
  removeLoading: () => void;
}
export const addLoadingMsg = function addLoadingMsg(
  converseUUID: string,
  cb: (event: LoadingCallbackEvent) => void
): TRPGAction {
  return function(dispatch, getState) {
    const fakeMsgPayload: MsgPayload = {
      message: '[处理中...]',
      type: 'loading',
      converse_uuid: converseUUID,
      data: {
        progress: 0,
      },
    };

    dispatch(
      addFakeMsg(fakeMsgPayload, (localUUID) => {
        cb({
          updateProgress: (progress) => {
            dispatch(
              updateMsg(converseUUID, {
                uuid: localUUID,
                data: {
                  progress,
                },
              })
            );
          },
          removeLoading: () => {
            dispatch(removeFakeMsg(converseUUID, localUUID));
          },
        });
      })
    );
  };
};

/**
 * 获取更多消息记录
 * @param converseUUID 会话UUID
 * @param offsetDate 起始日期
 * @param isUserChat 是否为用户会话
 */
export let getMoreChatLog = function getMoreChatLog(
  converseUUID: string,
  offsetDate: string,
  isUserChat = true
): TRPGAction {
  return function(dispatch, getState) {
    if (isUserChat) {
      api.emit(
        'chat::getUserChatLog',
        { user_uuid: converseUUID, offsetDate },
        function(data) {
          if (data.result === true) {
            dispatch(updateConversesMsglist(converseUUID, data.list));
            dispatch({
              type: SET_CONVERSES_MSGLOG_NOMORE,
              converseUUID,
              nomore: data.nomore,
            });
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
            dispatch({
              type: SET_CONVERSES_MSGLOG_NOMORE,
              converseUUID,
              nomore: data.nomore,
            });
          } else {
            console.log(data);
          }
        }
      );
    }
  };
};

export let updateCardChatData = function(chatUUID, newData): TRPGAction {
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
export let startWriting = function(type = 'user', uuid: string): TRPGAction {
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
        dispatch(stopWriting(type, uuid)); // 如果在规定时间后没有再次收到正在输入的信号，则视为已经停止输入了
      },
      config.chat.isWriting.timeout
    );
  };
};
export let stopWriting = function(type = 'user', uuid: string): TRPGAction {
  return {
    type: UPDATE_WRITING_STATUS,
    payload: {
      type,
      uuid,
      isWriting: false,
    },
  };
};

export const getUserEmotion = function(): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('chatemotion::getUserEmotionCatalog', null, function(data) {
      if (data.result) {
        dispatch({
          type: UPDATE_USER_CHAT_EMOTION_CATALOG,
          payload: data.catalogs,
        });
      } else {
        console.error(data.msg);
      }
    });
  };
};

/**
 * 根据表情包暗号添加用户表情包
 * @param {string} code 表情包暗号
 */
export const addUserEmotionCatalogWithSecretSignal = function(
  code: string
): TRPGAction {
  return function(dispatch, getState) {
    code = String(code).toUpperCase();
    return api.emit(
      'chatemotion::addUserEmotionWithSecretSignal',
      {
        code,
      },
      function(data) {
        if (data.result) {
          const catalog = data.catalog;
          dispatch({
            type: ADD_USER_CHAT_EMOTION_CATALOG,
            payload: catalog,
          });
          dispatch(showAlert('添加成功'));
        } else {
          dispatch(showAlert('添加失败:' + data.msg));
          console.error(data.msg);
        }
      }
    );
  };
};

/**
 * 设定某一会话为已读
 * @param converseUUID 会话UUID
 */
export const setConverseIsRead = function(converseUUID: string): TRPGAction {
  return { type: SET_CONVERSE_ISREAD, converseUUID };
};
