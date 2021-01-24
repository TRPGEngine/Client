import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import _invoke from 'lodash/invoke';
import _remove from 'lodash/remove';
import _orderBy from 'lodash/orderBy';
import _last from 'lodash/last';
import _unset from 'lodash/unset';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _pull from 'lodash/pull';
import _findIndex from 'lodash/findIndex';
import constants from '@redux/constants';
import type { ChatState } from '@redux/types/chat';
import { createReducer } from '@reduxjs/toolkit';
import {
  addConverse,
  markConverseMsgListQueryed,
  switchConverse,
  clearSelectedConverse,
} from '@redux/actions/chat';
const {
  RESET,
  ADD_CONVERSES,
  ADD_MSG,
  UPDATE_MSG,
  REMOVE_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_USER_CONVERSES_SUCCESS,
  CREATE_CONVERSES_SUCCESS,
  CREATE_CONVERSES_FAILED,
  UPDATE_CONVERSES_INFO_SUCCESS,
  UPDATE_CONVERSES_MSGLIST_SUCCESS,
  REMOVE_CONVERSES_SUCCESS,
  REMOVE_USER_CONVERSE,
  SWITCH_CONVERSES,
  CLEAR_SELECTED_CONVERSE,
  SEND_MSG_COMPLETED,
  SWITCH_GROUP,
  UPDATE_SYSTEM_CARD_CHAT_DATA,
  UPDATE_WRITING_STATUS,
  UPDATE_USER_CHAT_EMOTION_CATALOG,
  ADD_USER_CHAT_EMOTION_CATALOG,
  SET_CONVERSES_MSGLOG_NOMORE,
  SET_CONVERSE_ISREAD,
} = constants;

const initialState: ChatState = {
  selectedConverseUUID: '',
  queryedConverseList: [],
  conversesDesc: '', // 获取会话列表的提示信息
  converses: {
    // "systemUUID": {
    //   uuid: 'systemUUID',
    //   type: 'user',
    //   name: '系统',
    //   icon: '',
    //   lastMsg: '欢迎使用TPRG客户端',
    //   lastTime: new Date().valueOf(),
    //   msgList: [
    //     {
    //       room: '',
    //       uuid: 'welcomeMessage',
    //       sender: '系统',
    //       sender_uuid: 'systemUUID',
    //       to_uuid: '',
    //       type: 'normal',
    //       is_public: false,
    //       message: '欢迎使用TPRG客户端',
    //       date: new Date().valueOf()
    //     }
    //   ]
    // }
  },

  // 记录正在输入的列表
  writingList: {
    user: [], // 用户会话: [useruuid1, useruuid2]
    group: {}, // 团会话: {groupUUID: [useruuid1, useruuid2]}
    channel: {},
  },

  // 当前用户的所有表情包(除了emoji)
  emotions: {
    catalogs: [], // 用户的表情包列表
    favorites: [], // 收藏的单个表情图
  },
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(RESET, (state) => {
      state = initialState;
    })
    .addCase(addConverse, (state, action) => {
      const uuid = action.payload.uuid;
      const type = action.payload.type;
      if (
        _isNil(state.converses[uuid]) ||
        (type === 'group' && _get(state.converses, [uuid, 'type']) === 'user') // 这个case会强制将会话列表中错误的用户会话变成团会话
      ) {
        state.converses[uuid] = {
          msgList: [],
          lastMsg: '',
          lastTime: '' as any,
          ...action.payload,
        };
      }
    })
    .addCase(ADD_MSG, (state, action: any) => {
      const converseUUID = action.converseUUID;
      if (_isNil(state.converses[converseUUID])) {
        console.warn(
          'add msg failed: this converses is not exist',
          converseUUID
        );
        return;
      }
      const payload = action.payload;
      const msgList = state.converses[converseUUID].msgList;
      if (msgList.findIndex((msg) => msg.uuid === payload.uuid) === -1) {
        // 当在列表中找不到相同UUID的消息时, 才添加到列表中
        msgList.push(payload);
      }

      state.converses[converseUUID].lastMsg = payload.message;
      state.converses[converseUUID].lastTime = payload.date;
      state.converses[converseUUID].unread = action.unread || false;
    })
    .addCase(UPDATE_MSG, (state, action: any) => {
      if (_isNil(state.converses[action.converseUUID])) {
        return;
      }

      const msgList = state.converses[action.converseUUID].msgList;

      const msgIndex = msgList.findIndex(
        (item) => item.uuid === action.msgUUID
      );
      if (msgIndex >= 0) {
        msgList[msgIndex] = {
          ...msgList[msgIndex],
          ...action.payload,
        };

        if (
          _isString(action.payload.message) &&
          msgIndex === msgList.length - 1
        ) {
          // 如果修改了message且message是最后一条
          // 则更新lastMsg
          state.converses[action.converseUUID].lastMsg = action.payload.message;
        }
      }
    })
    .addCase(REMOVE_MSG, (state, action: any) => {
      if (_isNil(state.converses[action.converseUUID])) {
        return;
      }
      const msgList: any[] = state.converses[action.converseUUID].msgList;
      _remove(msgList, (item) => item.uuid === action.localUUID);
    })
    .addCase(GET_CONVERSES_REQUEST, (state) => {
      state.conversesDesc = '正在获取会话列表...';
    })
    .addCase(CREATE_CONVERSES_FAILED, (state) => {
      state.conversesDesc = '获取会话列表失败, 请重试';
    });

  const getConversesSuccess = (state: ChatState, action: any) => {
    const list = action.payload;
    if (list instanceof Array && list.length > 0) {
      const converses = state.converses;
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const uuid = item.uuid;
        const oldConverseInfo = !_isNil(converses) ? converses.uuid : null;
        converses[uuid] = {
          msgList: [],
          lastMsg: '',
          lastTime: '',
          ...oldConverseInfo,
          ...item,
        };
      }
    }
  };
  builder
    .addCase(GET_CONVERSES_SUCCESS, getConversesSuccess)
    .addCase(GET_USER_CONVERSES_SUCCESS, getConversesSuccess);

  builder
    .addCase(UPDATE_CONVERSES_MSGLIST_SUCCESS, (state, action: any) => {
      const convUUID = action.convUUID;
      const payload = action.payload;
      if (payload.length > 0) {
        const converse = state.converses[convUUID];
        if (_isNil(converse)) {
          return;
        }

        const oldList = converse.msgList;
        const lastLog = _last(_orderBy([...payload, ...oldList], 'date'));

        state.converses[convUUID].msgList = [
          ...state.converses[convUUID].msgList,
          ...payload,
        ].filter(
          (item, index, arr) =>
            arr.findIndex((x) => x.uuid === item.uuid) === index
        ); // 去重
        state.converses[convUUID].lastMsg = lastLog.message;
        state.converses[convUUID].lastTime = lastLog.date;
      }
    })
    .addCase(UPDATE_CONVERSES_INFO_SUCCESS, (state, action: any) => {
      if (action.payload.name) {
        state.converses[action.uuid].name = action.payload.name;
      }
      if (action.payload.icon) {
        state.converses[action.uuid].icon = action.payload.icon;
      }
    })
    .addCase(REMOVE_CONVERSES_SUCCESS, (state, action: any) => {
      _unset(state.converses, action.converseUUID);
    })
    .addCase(REMOVE_USER_CONVERSE, (state, action: any) => {
      _unset(state.converses, action.converseUUID);
    })
    .addCase(switchConverse, (state, action) => {
      const converseUUID = action.payload.converseUUID;
      state.selectedConverseUUID = converseUUID;
      const converse = state.converses[converseUUID];
      if (!_isNil(converse)) {
        converse.unread = false; // 已读未读;
      }
    })
    .addCase(clearSelectedConverse, (state, action) => {
      state.selectedConverseUUID = '';
    })
    .addCase(SEND_MSG_COMPLETED, (state, action: any) => {
      const { converseUUID, localUUID, payload } = action;
      const {
        result, // TODO: 送达提示
        pkg, // 服务端信息
      } = payload;
      const converse = state.converses[converseUUID];
      if (!_isNil(converse)) {
        const msgList = converse.msgList;

        // NOTE: 这里可能会有一个问题。就是在团消息中因为消息也会给自己发一份，
        // 因此如果SEND_MSG_COMPLETED在该条消息的团广播到达之后收到的话就会出现两条一样的消息
        // 如果socket.io能保证消息的时序的话就不会出现这个问题。观察一波
        const index = msgList.findIndex((item) => item.uuid === localUUID);
        if (index >= 0) {
          msgList[index] = {
            ...msgList[index],
            ...pkg,
          };
        }
      }
    })
    .addCase(SWITCH_GROUP, (state, action: any) => {
      if (!_isNil(state.converses[action.payload])) {
        state.converses[action.payload].unread = false;
      }
    })
    .addCase(CREATE_CONVERSES_SUCCESS, (state, action: any) => {
      const createConvUUID = action.payload.uuid;
      state.converses[createConvUUID] = {
        msgList: [],
        lastMsg: '',
        lastTime: '',
        ...action.payload,
      };
    })
    .addCase(UPDATE_SYSTEM_CARD_CHAT_DATA, (state, action: any) => {
      const msgList = _get(state, ['converses', 'trpgsystem', 'msgList']);
      if (!_isNil(msgList)) {
        const i = msgList.findIndex((msg) => msg.uuid === action.chatUUID);
        if (i >= 0) {
          msgList[i] = action.payload;
        }
      }
    })
    .addCase(UPDATE_WRITING_STATUS, (state, action: any) => {
      const {
        type = 'user',
        isWriting = false,
        uuid,
        groupUUID,
        channelUUID,
        currentText,
      } = action.payload;
      if (type === 'user') {
        // 处理用户的正在写信息
        const list = state.writingList.user;
        if (isWriting) {
          if (!list.includes(uuid)) {
            list.push(uuid);
          }
        } else {
          _pull(list, uuid);
        }
      } else if (type === 'group') {
        const map = state.writingList.group;
        const groupWritingList = map[groupUUID] ?? [];
        const targetIndex = _findIndex(groupWritingList, ['uuid', uuid]);
        if (isWriting) {
          // 正在写
          if (targetIndex === -1) {
            // 新增用户正在写
            groupWritingList.push({
              uuid,
              text: currentText,
            });
          } else {
            // 更新用户正在写
            _set(groupWritingList, [targetIndex, 'text'], currentText);
          }
        } else {
          // 取消写
          if (targetIndex >= 0) {
            groupWritingList.splice(targetIndex, 1);
          }
        }

        _set(map, [groupUUID], groupWritingList);
      } else if (type === 'channel') {
        const map = state.writingList.channel;
        const channelWritingList = map[channelUUID] ?? [];
        const targetIndex = _findIndex(channelWritingList, ['uuid', uuid]);
        if (isWriting) {
          // 正在写
          if (targetIndex === -1) {
            // 新增用户正在写
            channelWritingList.push({
              uuid,
              text: currentText,
            });
          } else {
            // 更新用户正在写
            _set(channelWritingList, [targetIndex, 'text'], currentText);
          }
        } else {
          // 取消写
          if (targetIndex >= 0) {
            channelWritingList.splice(targetIndex, 1);
          }
        }

        _set(map, [channelUUID], channelWritingList);
      }
    })
    .addCase(UPDATE_USER_CHAT_EMOTION_CATALOG, (state, action: any) => {
      const catalogs = action.payload;
      state.emotions.catalogs = catalogs;
    })
    .addCase(ADD_USER_CHAT_EMOTION_CATALOG, (state, action: any) => {
      const catalog = action.payload;
      const i = state.emotions.catalogs.findIndex(
        (item) => item.uuid === catalog.uuid
      );

      if (i === -1) {
        state.emotions.catalogs.push(catalog);
      }
    })
    .addCase(SET_CONVERSES_MSGLOG_NOMORE, (state, action: any) => {
      const converseUUID = action.converseUUID;
      const nomore = action.nomore;
      _set(state, ['converses', converseUUID, 'nomore'], nomore);
    })
    .addCase(SET_CONVERSE_ISREAD, (state, action: any) => {
      const converseUUID = action.converseUUID;
      _set(state, ['converses', converseUUID, 'unread'], false);
    })
    .addCase(markConverseMsgListQueryed, (state, action) => {
      state.queryedConverseList.push(action.payload.converseUUID);
    });
});
