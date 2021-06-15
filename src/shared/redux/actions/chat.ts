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
  MARK_CONVERSE_MSGLIST_QUERYED,
} = constants;
import * as trpgApi from '../../api/trpg.api';
const api = trpgApi.getInstance();
import rnStorage from '../../api/rn-storage.api';
import { checkUser } from '../../utils/cache-helper';
import { hideProfileCard, switchMenuPannel, showToast, showAlert } from './ui';
import * as uploadHelper from '../../utils/upload-helper';
import { renewableDelayTimer, cancelDelayTimer } from '../../utils/timer';
import config from '../../project.config';
import _without from 'lodash/without';
import _isFunction from 'lodash/isFunction';
import _filter from 'lodash/filter';
import type {
  MsgPayload,
  ConverseInfo,
  SendMsgPayload,
  ChatStateConverse,
} from '@src/shared/redux/types/chat';
import type { TRPGAction } from '../types/__all__';
import { isUserUUID } from '@shared/utils/uuid';
import { createAction } from '@reduxjs/toolkit';
import { showToasts } from '@shared/manager/ui';
import { reportError } from '@web/utils/error';
import { t } from '@shared/i18n';

const getUserConversesHash = (userUUID: string): string => {
  return `userConverses#${userUUID}`;
};

/**
 * 获取本地UUID
 */
let localIndex = 0;
const getLocalUUID = function getLocalUUID() {
  return 'local#' + localIndex++;
};

// 切换当前会话页面
export const switchConverse = createAction(
  SWITCH_CONVERSES,
  (converseUUID: string) => ({ payload: { converseUUID } })
);

// 跳转到会话页面并切换到会话
export const switchToConverse = function switchToConverse(
  converseUUID: string
): TRPGAction {
  return function (dispatch, getState) {
    dispatch(hideProfileCard());
    dispatch(switchMenuPannel(0));
    dispatch(switchConverse(converseUUID));
  };
};

/**
 * 清理当前选择的会话
 */
export const clearSelectedConverse = createAction('CLEAR_SELECTED_CONVERSE');

export const addConverse =
  createAction<
    Partial<ChatStateConverse> &
      Pick<ChatStateConverse, 'uuid' | 'type' | 'name'>
  >(ADD_CONVERSES);

export const updateConversesMsglist = function updateConversesMsglist(
  convUUID: string,
  list: any[]
): TRPGAction {
  return function (dispatch, getState) {
    for (const item of list) {
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

/**
 * 获取多人会话
 */
export const getConverses = function getConverses(cb?: () => void): TRPGAction {
  return async function (dispatch, getState) {
    dispatch({ type: GET_CONVERSES_REQUEST });

    try {
      // 获取会话列表
      const data = await api.emitP('chat::getConverses', {});
      if (typeof cb === 'function') {
        cb();
      }

      const list = data.list;
      dispatch({ type: GET_CONVERSES_SUCCESS, payload: list });
      const uuid = getState().user.info.uuid;
      checkUser(uuid);
      // 用户聊天记录
      for (const item of list) {
        const convUUID = item.uuid;
        // 获取日志
        if (!/^trpg/.test(convUUID)) {
          checkUser(convUUID);
        }

        // TODO
        api.emit(
          'chat::getConverseChatLog',
          { converse_uuid: convUUID },
          function (data) {
            if (data.result) {
              dispatch(updateConversesMsglist(convUUID, data.list));
            } else {
              console.error('获取聊天记录失败:', data.msg);
            }
          }
        );
      }
    } catch (err) {
      showToasts(t('多人会话加载失败'), 'error');
      reportError('多人会话加载失败:' + String(err));
      console.error(err);
    }
  };
};

/**
 * @deprecated 弃用
 */
export const createConverse = function createConverse(
  uuid,
  type,
  isSwitchToConv = true
): TRPGAction {
  return function (dispatch, getState) {
    if (!!getState().chat.converses[uuid]) {
      console.log('已存在该会话');
      if (isSwitchToConv) {
        dispatch(switchToConverse(uuid));
      }
      return;
    }
    return api.emit('chat::createConverse', { uuid, type }, function (data) {
      console.log('chat::createConverse', data);
      if (data.result) {
        const conv = data.data;
        dispatch({ type: CREATE_CONVERSES_SUCCESS, payload: conv });

        const convUUID = conv.uuid;
        if (isSwitchToConv) {
          dispatch(switchToConverse(convUUID));
        }
        // 获取日志
        checkUser(uuid);
        api.emit(
          'chat::getConverseChatLog',
          { converse_uuid: convUUID },
          function (data) {
            if (data.result) {
              const list = data.list;
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

/**
 * 移除多人会话
 * @param converseUUID 会话UUID
 */
export const removeConverse = function removeConverse(
  converseUUID: string
): TRPGAction {
  return function (dispatch, getState) {
    return api.emit('chat::removeConverse', { converseUUID }, function (data) {
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
    const userUUID = getState().user.info.uuid!;
    const converses = getState().chat.converses;
    const uuids = Object.keys(_filter(converses, (c) => c.type === 'user'));
    rnStorage.set(
      getUserConversesHash(userUUID),
      _without(uuids, userConverseUUID)
    );
  };
};

/**
 * 增加用户UUID会话列表
 * 并获取用户的信息
 * @param senders 会话UUID列表
 */
export const addUserConverse = function addUserConverse(
  senders: string[]
): TRPGAction {
  return function (dispatch, getState) {
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
    const userUUID = getState().user.info.uuid!;
    rnStorage
      .get(getUserConversesHash(userUUID), [])
      .then((cachedConverse: string[]) => {
        const allConverse: string[] = Array.from(
          new Set([...cachedConverse, ...senders])
        );
        rnStorage
          .set(getUserConversesHash(userUUID), allConverse)
          .then((data) => console.log('用户会话缓存完毕:', data));
      });

    for (const uuid of senders) {
      if (!isUserUUID(uuid)) {
        continue;
      }

      // 更新会话信息
      api.emit('player::getInfo', { type: 'user', uuid }, (data) => {
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
      api.emit('chat::getUserChatLog', { user_uuid: uuid }, function (data) {
        if (data.result) {
          const list = data.list;
          dispatch(updateConversesMsglist(uuid, list));
        } else {
          console.error('获取聊天记录失败:' + data.msg);
        }
      });
    }

    // 更新系统消息
    api.emit(
      'chat::getUserChatLog',
      { user_uuid: 'trpgsystem' },
      function (data) {
        if (data.result) {
          const list = data.list;
          dispatch(updateConversesMsglist('trpgsystem', list));
        } else {
          console.error('获取聊天记录失败:' + data.msg);
        }
      }
    );
  };
};

export const getOfflineUserConverse = function getOfflineUserConverse(
  lastLoginDate: string
): TRPGAction {
  return function (dispatch, getState) {
    api.emit(
      'chat::getOfflineUserConverse',
      { lastLoginDate },
      function (data) {
        if (data.result === true) {
          dispatch(addUserConverse(data.senders));
        } else {
          console.error(data);
        }
      }
    );
  };
};

export const getAllUserConverse = function getAllUserConverse(): TRPGAction {
  return function (dispatch, getState) {
    api.emit('chat::getAllUserConverse', {}, function (data) {
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
export const reloadConverseList = function reloadConverseList(
  cb?: () => void
): TRPGAction {
  return function (dispatch, getState) {
    const userInfo = getState().user.info;
    const userUUID = userInfo.uuid!;

    // 多人会话
    dispatch(getConverses(cb));

    // 用户会话
    rnStorage.get(getUserConversesHash(userUUID)).then(function (converse) {
      console.log('缓存中的用户会话列表:', converse);
      if (converse && converse.length > 0) {
        // 如果本地缓存有存在用户会话，则根据上次登录时间获取这段时间内新建的用户会话
        dispatch(addUserConverse(converse));
        dispatch(getOfflineUserConverse(userInfo.last_login!));
      } else {
        // 如果本地没有存在用户会话，则获取所有的用户会话
        dispatch(getAllUserConverse());
      }
    });
  };
};

export const addMsg = function addMsg(converseUUID, payload): TRPGAction {
  return (dispatch, getState) => {
    if (!(converseUUID && typeof converseUUID === 'string')) {
      console.error('[addMsg]add message need converseUUID:', converseUUID);
      return;
    }

    if (!getState().chat.converses[converseUUID]) {
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
      converseUUID === getState().chat.selectedConverseUUID ||
      converseUUID === getState().group.selectedGroupUUID
    ) {
      unread = false;
    }

    // if(!!payload && !payload.uuid) {
    //   console.error('[addMsg]payload need uuid:', payload);
    //   return;
    // }
    dispatch({ type: ADD_MSG, converseUUID, unread, payload });
  };
};

export const updateMsg = function updateMsg(converseUUID, payload): TRPGAction {
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
export const sendMsg = function sendMsg(
  toUUID: string | null,
  payload: SendMsgPayload
): TRPGAction {
  return function (dispatch, getState) {
    const info = getState().user.info;
    const localUUID = getLocalUUID();
    const pkg = {
      sender_uuid: info.uuid, // 此处虽然构造了sender_uuid。但只用于本地消息临时自己的显示, 服务端不会接受该数据
      to_uuid: toUUID,
      converse_uuid: payload.converse_uuid,
      group_uuid: payload.group_uuid,
      type: payload.type,
      message: payload.message,
      is_public: payload.is_public,
      is_group: payload.is_group,
      date: new Date().toISOString(),
      data: payload.data,
      uuid: localUUID,
    };

    const converseUUID = payload.converse_uuid || toUUID;
    dispatch(addMsg(converseUUID, pkg));
    return api.emit('chat::message', pkg, function (data) {
      if (data.result) {
        // TODO: 待实现SEND_MSG_COMPLETED的数据处理方法(用于送达提示)
        dispatch({
          type: SEND_MSG_COMPLETED,
          payload: data,
          localUUID,
          converseUUID,
        });
        console.log('发送成功');
      } else {
        dispatch(showToast('消息发送失败'));
        console.log('发送失败', pkg);
      }
    });
  };
};

export const sendFile = function sendFile(toUUID, payload, file): TRPGAction {
  if (!file) {
    console.error('发送文件错误。没有找到要发送的文件');
    return function (dispatch, getState) {};
  }

  return function (dispatch, getState) {
    const info = getState().user.info;
    const selfUserUUID = info.uuid!;
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
    const converseUUID = payload.converse_uuid || toUUID;
    dispatch(addMsg(converseUUID, pkg));

    // 通过该方法发送的文件均为会话文件，存到临时文件夹
    uploadHelper.toTemporary(selfUserUUID, file, {
      onProgress(progress) {
        dispatch(
          updateMsg(payload.converse_uuid || toUUID, {
            uuid: pkg.uuid,
            data: Object.assign({}, pkg.data, { progress }),
          })
        );
      },
      onCompleted(fileinfo) {
        const filedata = Object.assign({}, pkg.data, fileinfo, { progress: 1 });
        pkg = Object.assign({}, pkg, { data: filedata });
        // 文件上传完毕。正式发送文件消息
        api.emit('chat::message', pkg, function (data) {
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
 * 撤回消息
 * @param msgUUID 消息UUID
 */
export const revokeMsg = function revokeMsg(messageUUID: string): TRPGAction {
  return (dispatch, getState) => {
    api.emit(
      'chat::revokeMsg',
      {
        messageUUID,
      },
      (data) => {
        if (data.result === false) {
          // 撤回提示
          console.error('消息撤回失败', data.msg);
          dispatch(showToast('消息撤回失败:' + data.msg));
        }
      }
    );
  };
};

/**
 * 添加一条假的本地消息。当外部满足一定条件后需要把这条消息删除
 * @param pkg 消息内容
 * @param callback 添加后的回调
 */
export const addFakeMsg = function addFakeMsg(
  pkg: Partial<MsgPayload>,
  callback?: (localUUID: string) => void
): TRPGAction {
  return function (dispatch, getState) {
    const info = getState().user.info;
    const localUUID = getLocalUUID();
    pkg.uuid = localUUID;
    if (!pkg.sender_uuid) {
      pkg.sender_uuid = info.uuid;
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
  return function (dispatch, getState) {
    const fakeMsgPayload: Partial<MsgPayload> = {
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
export const getMoreChatLog = function getMoreChatLog(
  converseUUID: string,
  offsetDate: string,
  isUserChat = true
): TRPGAction {
  return function (dispatch, getState) {
    if (isUserChat) {
      api.emit(
        'chat::getUserChatLog',
        { user_uuid: converseUUID, offsetDate },
        function (data) {
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
        function (data) {
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

export const updateCardChatData = function (chatUUID, newData): TRPGAction {
  return function (dispatch, getState) {
    return api.emit(
      'chat::updateCardChatData',
      { chatUUID, newData },
      function (data) {
        if (data.result) {
          dispatch({
            type: UPDATE_SYSTEM_CARD_CHAT_DATA,
            chatUUID,
            payload: data.log,
          });
        } else {
          console.error(data.msg);
        }
      }
    );
  };
};

const getWriteHash = (type: string, uuid: string, groupUUID?: string) => {
  return [type, uuid, groupUUID].join('#');
};
export const startWriting = function (
  type = 'user',
  uuid: string,
  groupUUID?: string,
  channelUUID?: string,
  currentText?: string
): TRPGAction {
  return function (dispatch, getState) {
    dispatch({
      type: UPDATE_WRITING_STATUS,
      payload: {
        type,
        uuid,
        groupUUID,
        channelUUID,
        currentText,
        isWriting: true,
      },
    });

    renewableDelayTimer(
      getWriteHash(type, uuid, groupUUID),
      function () {
        dispatch(stopWriting(type, uuid, groupUUID)); // 如果在规定时间后没有再次收到正在输入的信号，则视为已经停止输入了
      },
      config.chat.isWriting.timeout
    );
  };
};
export const stopWriting = function (
  type = 'user',
  uuid: string,
  groupUUID?: string,
  channelUUID?: string
): TRPGAction {
  cancelDelayTimer(getWriteHash(type, uuid, groupUUID));

  return {
    type: UPDATE_WRITING_STATUS,
    payload: {
      type,
      uuid,
      groupUUID,
      channelUUID,
      isWriting: false,
    },
  };
};

export const getUserEmotion = function (): TRPGAction {
  return function (dispatch, getState) {
    return api.emit(
      'chatemotion::getUserEmotionCatalog',
      null,
      function (data) {
        if (data.result) {
          dispatch({
            type: UPDATE_USER_CHAT_EMOTION_CATALOG,
            payload: data.catalogs,
          });
        } else {
          console.error(data.msg);
        }
      }
    );
  };
};

/**
 * 根据表情包暗号添加用户表情包
 * @param {string} code 表情包暗号
 */
export const addUserEmotionCatalogWithSecretSignal = function (
  code: string
): TRPGAction {
  return function (dispatch, getState) {
    code = String(code).toUpperCase();
    return api.emit(
      'chatemotion::addUserEmotionWithSecretSignal',
      {
        code,
      },
      function (data) {
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
export const setConverseIsRead = function (converseUUID: string): TRPGAction {
  return { type: SET_CONVERSE_ISREAD, converseUUID };
};

/**
 * 标记一个会话以及被请求过
 */
export const markConverseMsgListQueryed = createAction(
  MARK_CONVERSE_MSGLIST_QUERYED,
  (converseUUID: string) => {
    return { payload: { converseUUID } };
  }
);
