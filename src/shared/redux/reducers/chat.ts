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
import constants from '@redux/constants';
import { ChatState, ChatStateConverseMsgList } from '@redux/types/chat';
import produce from 'immer';
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
  },

  // 当前用户的所有表情包(除了emoji)
  emotions: {
    catalogs: [], // 用户的表情包列表
    favorites: [], // 收藏的单个表情图
  },
};

export default produce((draft: ChatState, action) => {
  let payload;
  switch (action.type) {
    case RESET:
      return initialState;
    case ADD_CONVERSES: {
      const uuid = action.payload.uuid;
      if (_isNil(draft.converses[uuid])) {
        draft.converses[uuid] = {
          msgList: [],
          lastMsg: '',
          lastTime: '',
          ...action.payload,
        };
      }
      return;
      // let uuid = action.payload.uuid;
      // if (!state.getIn(['converses', uuid])) {
      //   let payload = Object.assign(
      //     {},
      //     {
      //       msgList: [],
      //       lastMsg: '',
      //       lastTime: '',
      //     },
      //     action.payload
      //   );
      //   return state.setIn(['converses', uuid], immutable.fromJS(payload));
      // } else {
      //   // 如果有会话了直接返回
      //   return state;
      // }
    }
    case ADD_MSG: {
      const converseUUID = action.converseUUID;
      if (_isNil(draft.converses[converseUUID])) {
        console.warn(
          'add msg failed: this converses is not exist',
          converseUUID
        );
        return;
      }
      payload = action.payload;
      const msgList = draft.converses[converseUUID].msgList;
      if (msgList.findIndex((msg) => msg.uuid === payload.uuid) === -1) {
        // 当在列表中找不到相同UUID的消息时, 才添加到列表中
        msgList.push(payload);
      }

      draft.converses[converseUUID].lastMsg = payload.message;
      draft.converses[converseUUID].lastTime = payload.date;
      draft.converses[converseUUID].unread = action.unread || false; //已读未读
      return;

      // return state
      //   .updateIn(
      //     ['converses', converseUUID, 'msgList'],
      //     (msgList: ChatStateConverseMsgList) => {
      //       if (
      //         msgList.findIndex(
      //           (msg) => msg.get('uuid') === payload.get('uuid')
      //         ) === -1
      //       ) {
      //         // 当在列表中找不到相同UUID的消息时, 才添加到列表中
      //         msgList = msgList.push(payload);
      //       }

      //       return msgList;
      //     }
      //   )
      //   .setIn(['converses', converseUUID, 'lastMsg'], payload.get('message'))
      //   .setIn(['converses', converseUUID, 'lastTime'], payload.get('date'))
      //   .setIn(['converses', converseUUID, 'unread'], action.unread || false); //已读未读
    }
    case UPDATE_MSG: {
      if (_isNil(draft.converses[action.converseUUID])) {
        return;
      }

      const msgList = draft.converses[action.converseUUID].msgList;

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
          draft.converses[action.converseUUID].lastMsg = action.payload.message;
        }
      }

      return;
    }
    // return state.updateIn(
    //   ['converses', action.converseUUID, 'msgList'],
    //   (msgList) => {
    //     if (msgList) {
    //       for (var i = 0; i < msgList.size; i++) {
    //         let msg = msgList.get(i);
    //         if (msg.get('uuid') === action.msgUUID) {
    //           msgList = msgList.set(
    //             i,
    //             msg.merge(immutable.fromJS(action.payload))
    //           );
    //           break;
    //         }
    //       }
    //     } else {
    //       console.error(
    //         'update msglist failed, not find msgList in',
    //         action.converseUUID
    //       );
    //     }

    //     return msgList;
    //   }
    // );
    case REMOVE_MSG:
      if (_isNil(draft.converses[action.converseUUID])) {
        return;
      }
      const msgList: any[] = draft.converses[action.converseUUID].msgList;
      _remove(msgList, (item) => item.uuid === action.localUUID);
      return;

    // return state.updateIn(
    //   ['converses', action.converseUUID, 'msgList'],
    //   (msgList) => {
    //     if (msgList) {
    //       const msgIndex = msgList.findIndex(
    //         (msg) => msg.get('uuid') === action.localUUID
    //       );
    //       if (msgIndex >= 0) {
    //         return msgList.delete(msgIndex);
    //       }
    //     }

    //     return msgList;
    //   }
    // );
    case GET_CONVERSES_REQUEST:
      draft.conversesDesc = '正在获取会话列表...';
      return;
    // return state.set('conversesDesc', '正在获取会话列表...');
    case CREATE_CONVERSES_FAILED:
      draft.conversesDesc = '获取会话列表失败, 请重试';
      return;
    // return state.set('conversesDesc', '获取会话列表失败, 请重试');
    case GET_CONVERSES_SUCCESS:
    case GET_USER_CONVERSES_SUCCESS: {
      const list = action.payload;
      if (list instanceof Array && list.length > 0) {
        const converses = draft.converses;
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
        // let converses = state.get('converses');
        // for (var i = 0; i < list.length; i++) {
        //   const item = list[i];
        //   const uuid = item.uuid;
        //   const oldConverseInfo = !_isNil(converses)
        //     ? _invoke(converses.get(uuid), 'toJS')
        //     : null;
        //   const obj = Object.assign(
        //     {},
        //     {
        //       msgList: [],
        //       lastMsg: '',
        //       lastTime: '',
        //     },
        //     oldConverseInfo,
        //     item
        //   );
        //   converses = converses.set(uuid, immutable.fromJS(obj));
        // }
        // return state.setIn(['converses'], converses);
      }
      return;
    }
    case UPDATE_CONVERSES_MSGLIST_SUCCESS: {
      const convUUID = action.convUUID;
      const payload = action.payload;
      if (payload.length > 0) {
        const converse = draft.converses[convUUID];
        if (_isNil(converse)) {
          return;
        }

        const oldList = converse.msgList;
        const lastLog = _last(_orderBy([...payload, ...oldList], 'date'));

        draft.converses[convUUID].msgList = [
          ...draft.converses[convUUID].msgList,
          ...payload,
        ].filter(
          (item, index, arr) =>
            arr.findIndex((x) => x.uuid === item.uuid) === index
        ); // 去重
        draft.converses[convUUID].lastMsg = lastLog.message;
        draft.converses[convUUID].lastTime = lastLog.date;
      }
      return;

      // payload = immutable.fromJS(action.payload);
      // if (payload.size > 0) {
      //   let oldList = state.getIn(['converses', convUUID, 'msgList']);
      //   let lastLog = payload
      //     .concat(oldList)
      //     .sortBy((item) => item.get('date'))
      //     .last();
      //   return state
      //     .updateIn(
      //       ['converses', convUUID, 'msgList'],
      //       (list) =>
      //         list
      //           .concat(payload)
      //           .filter(
      //             (item, index, arr) =>
      //               arr.findIndex(
      //                 (x) => x.get('uuid') === item.get('uuid')
      //               ) === index
      //           ) //添加一步去重操作
      //     )
      //     .setIn(['converses', convUUID, 'lastMsg'], lastLog.get('message'))
      //     .setIn(['converses', convUUID, 'lastTime'], lastLog.get('date'));
      // } else {
      //   return state;
      // }
    }
    case UPDATE_CONVERSES_INFO_SUCCESS:
      if (action.payload.name) {
        draft.converses[action.uuid].name = action.payload.name;
        // state = state.setIn(
        //   ['converses', action.uuid, 'name'],
        //   action.payload.name
        // );
      }
      if (action.payload.icon) {
        draft.converses[action.uuid].icon = action.payload.icon;
        // state = state.setIn(
        //   ['converses', action.uuid, 'icon'],
        //   action.payload.icon
        // );
      }
      return;
    case REMOVE_CONVERSES_SUCCESS:
    case REMOVE_USER_CONVERSE:
      _unset(draft.converses, action.converseUUID);
      return;
    // return state.deleteIn(['converses', action.converseUUID]);
    case SWITCH_CONVERSES:
      draft.selectedConverseUUID = action.converseUUID;
      const converse = draft.converses[action.converseUUID];
      if (!_isNil(converse)) {
        converse.unread = false; //已读未读;
      }
      return;
    case CLEAR_SELECTED_CONVERSE:
      draft.selectedConverseUUID = '';
      return;
    // return state.set('selectedConverseUUID', '');
    case SEND_MSG_COMPLETED: {
      const { converseUUID, localUUID, payload } = action;
      const {
        result, // TODO: 送达提示
        pkg, // 服务端信息
      } = payload;
      const converse = draft.converses[converseUUID];
      if (!_isNil(converse)) {
        const msgList = converse.msgList;

        const index = msgList.findIndex((item) => item.uuid === localUUID);
        if (index >= 0) {
          msgList[index] = {
            ...msgList[index],
            ...pkg,
          };
        }
      }

      return;

      // return state.updateIn(
      //   ['converses', converseUUID, 'msgList'],
      //   (list) => {
      //     if (list) {
      //       for (var i = 0; i < list.size; i++) {
      //         let msg = list.get(i);
      //         if (msg.get('uuid') === localUUID) {
      //           list = list.set(i, msg.merge(immutable.fromJS(pkg)));
      //           break;
      //         }
      //       }
      //     } else {
      //       console.error(
      //         'update msglist failed, not find msgList in',
      //         converseUUID
      //       );
      //     }

      //     return list;
      //   }
      // );
    }
    case SWITCH_GROUP: {
      if (!_isNil(draft.converses[action.payload])) {
        draft.converses[action.payload].unread = false;
      }
      return;

      // if (!_isNil(state.getIn(['converses', action.payload]))) {
      //   return state.setIn(['converses', action.payload, 'unread'], false);
      // } else {
      //   return state;
      // }
    }
    case CREATE_CONVERSES_SUCCESS: {
      const createConvUUID = action.payload.uuid;
      draft.converses[createConvUUID] = {
        msgList: [],
        lastMsg: '',
        lastTime: '',
        ...action.payload,
      };
      return;
    }
    case UPDATE_SYSTEM_CARD_CHAT_DATA: {
      const msgList = _get(draft, ['converses', 'trpgsystem', 'msgList']);
      if (!_isNil(msgList)) {
        const i = msgList.findIndex((msg) => msg.uuid === action.chatUUID);
        if (i >= 0) {
          msgList[i] = action.payload;
        }
      }
      return;

      // return state.updateIn(
      //   ['converses', 'trpgsystem', 'msgList'],
      //   (list) => {
      //     for (var i = 0; i < list.size; i++) {
      //       if (list.getIn([i, 'uuid']) === action.chatUUID) {
      //         list = list.set(i, immutable.fromJS(action.payload));
      //       }
      //     }

      //     return list;
      //   }
      // );
    }
    case UPDATE_WRITING_STATUS: {
      const { type = 'user', isWriting = false, uuid } = action.payload;
      if (type === 'user') {
        // 处理用户的正在写信息
        const list = draft.writingList.user;
        if (isWriting) {
          if (!list.includes(uuid)) {
            list.push(uuid);
          } else {
            _pull(list, uuid);
          }
        }
        // return state.updateIn(['writingList', 'user'], (list) => {
        //   if (isWriting) {
        //     if (!list.includes(uuid)) {
        //       list = list.push(uuid);
        //     }
        //     return list;
        //   } else {
        //     return list.delete(list.findIndex((item) => item === uuid));
        //   }
        // });
      }

      // TODO: 团正在输入待实现
      return;
    }
    case UPDATE_USER_CHAT_EMOTION_CATALOG: {
      const catalogs = action.payload;
      draft.emotions.catalogs = catalogs;
      return;
      // return state.setIn(
      //   ['emotions', 'catalogs'],
      //   immutable.fromJS(catalogs)
      // );
    }
    case ADD_USER_CHAT_EMOTION_CATALOG: {
      const catalog = action.payload;
      const i = draft.emotions.catalogs.findIndex(
        (item) => item.uuid === catalog.uuid
      );

      if (i === -1) {
        draft.emotions.catalogs.push(catalog);
      }
      return;

      // return state.updateIn(['emotions', 'catalogs'], (list) => {
      //   for (let i = 0; i < list.size; i++) {
      //     if (list.getIn([i, 'uuid']) === catalog.uuid) {
      //       console.log('该表情包已添加');
      //       return list;
      //     }
      //   }

      //   return list.push(immutable.fromJS(catalog));
      // });
    }
    case SET_CONVERSES_MSGLOG_NOMORE: {
      const converseUUID = action.converseUUID;
      const nomore = action.nomore;
      _set(draft, ['converses', converseUUID, 'nomore'], nomore);
      return;
      // return state.setIn(['converses', converseUUID, 'nomore'], nomore);
    }
    case SET_CONVERSE_ISREAD: {
      const converseUUID = action.converseUUID;
      _set(draft, ['converses', converseUUID, 'unread'], false);
      return;
      // return state.setIn(['converses', converseUUID, 'unread'], false);
    }
  }
}, initialState);
