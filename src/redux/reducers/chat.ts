import constants from '../constants';
import immutable, { List, Map, Record } from 'immutable';
const {
  RESET,
  ADD_CONVERSES,
  ADD_MSG,
  UPDATE_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_USER_CONVERSES_SUCCESS,
  // CREATE_CONVERSES_REQUEST,
  CREATE_CONVERSES_SUCCESS,
  CREATE_CONVERSES_FAILED,
  UPDATE_CONVERSES_INFO_SUCCESS,
  UPDATE_CONVERSES_MSGLIST_SUCCESS,
  REMOVE_CONVERSES_SUCCESS,
  REMOVE_USER_CONVERSE,
  SWITCH_CONVERSES,
  SEND_MSG_COMPLETED,
  SWITCH_GROUP,
  UPDATE_SYSTEM_CARD_CHAT_DATA,
  UPDATE_WRITING_STATUS,
  UPDATE_USER_CHAT_EMOTION_CATALOG,
  ADD_USER_CHAT_EMOTION_CATALOG,
} = constants;

type WritingListType =
  | Map<'user', List<string>>
  | Map<'group', Map<string, List<string>>>;

export type ChatState = Record<{
  selectedConversesUUID: string;
  conversesDesc: string;
  converses: Map<string, any>;
  writingList: WritingListType;
  emotions: Map<'catalogs' | 'favorites', List<any>>;
}>;

const initialState: ChatState = immutable.fromJS({
  selectedConversesUUID: '',
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
});

export default function chat(state = initialState, action) {
  try {
    let payload;
    switch (action.type) {
      case RESET:
        return initialState;
      case ADD_CONVERSES: {
        let uuid = action.payload.uuid;
        if (!state.getIn(['converses', uuid])) {
          let payload = Object.assign(
            {},
            {
              msgList: [],
              lastMsg: '',
              lastTime: '',
            },
            action.payload
          );
          return state.setIn(['converses', uuid], immutable.fromJS(payload));
        } else {
          // 如果有会话了直接返回
          return state;
        }
      }
      case ADD_MSG: {
        let converseUUID = action.converseUUID;
        if (!state.getIn(['converses', converseUUID])) {
          console.warn(
            'add msg failed: this converses is not exist',
            converseUUID
          );
          return state;
        }
        payload = immutable.fromJS(action.payload);

        return state
          .updateIn(['converses', converseUUID, 'msgList'], (msgList) =>
            msgList.push(payload)
          )
          .setIn(['converses', converseUUID, 'lastMsg'], payload.get('message'))
          .setIn(['converses', converseUUID, 'lastTime'], payload.get('date'))
          .setIn(['converses', converseUUID, 'unread'], action.unread); //已读未读
      }
      case UPDATE_MSG:
        return state.updateIn(
          ['converses', action.converseUUID, 'msgList'],
          (msgList) => {
            if (msgList) {
              for (var i = 0; i < msgList.size; i++) {
                let msg = msgList.get(i);
                if (msg.get('uuid') === action.msgUUID) {
                  msgList = msgList.set(
                    i,
                    msg.merge(immutable.fromJS(action.payload))
                  );
                  break;
                }
              }
            } else {
              console.error(
                'update msglist failed, not find msgList in',
                action.converseUUID
              );
            }

            return msgList;
          }
        );
      case GET_CONVERSES_REQUEST:
        return state.set('conversesDesc', '正在获取会话列表...');
      case CREATE_CONVERSES_FAILED:
        return state.set('conversesDesc', '获取会话列表失败, 请重试');
      case GET_CONVERSES_SUCCESS:
      case GET_USER_CONVERSES_SUCCESS: {
        let list = action.payload;
        if (list instanceof Array && list.length > 0) {
          let converses = state.get('converses');
          for (var i = 0; i < list.length; i++) {
            let item = list[i];
            let uuid = item.uuid;
            let obj = Object.assign(
              {},
              {
                msgList: [],
                lastMsg: '',
                lastTime: '',
              },
              item
            );
            converses = converses.set(uuid, immutable.fromJS(obj));
          }
          return state.setIn(['converses'], converses);
        }
        return state;
      }
      case UPDATE_CONVERSES_MSGLIST_SUCCESS: {
        let convUUID = action.convUUID;
        payload = immutable.fromJS(action.payload);
        if (payload.size > 0) {
          let oldList = state.getIn(['converses', convUUID, 'msgList']);
          let lastLog = payload
            .concat(oldList)
            .sortBy((item) => item.get('date'))
            .last();
          return state
            .updateIn(['converses', convUUID, 'msgList'], (list) =>
              immutable.List(immutable.Set(list.concat(payload)))
            ) //添加一步去重操作
            .setIn(['converses', convUUID, 'lastMsg'], lastLog.get('message'))
            .setIn(['converses', convUUID, 'lastTime'], lastLog.get('date'));
        } else {
          return state;
        }
      }
      case UPDATE_CONVERSES_INFO_SUCCESS:
        if (action.payload.name) {
          state = state.setIn(
            ['converses', action.uuid, 'name'],
            action.payload.name
          );
        }
        if (action.payload.icon) {
          state = state.setIn(
            ['converses', action.uuid, 'icon'],
            action.payload.icon
          );
        }
        return state;
      case REMOVE_CONVERSES_SUCCESS:
        return state.deleteIn(['converses', action.converseUUID]);
      case REMOVE_USER_CONVERSE:
        return state.deleteIn(['converses', action.converseUUID]);
      case SWITCH_CONVERSES:
        return state
          .set('selectedConversesUUID', action.converseUUID)
          .setIn(['converses', action.converseUUID, 'unread'], false); //已读未读;
      case SEND_MSG_COMPLETED: {
        let converseUUID = action.converseUUID;
        let localUUID = action.localUUID;
        let payload = action.payload;
        let result = payload.result; // TODO: 送达提示
        let pkg = payload.pkg; // 服务端信息
        return state.updateIn(
          ['converses', converseUUID, 'msgList'],
          (list) => {
            if (list) {
              for (var i = 0; i < list.size; i++) {
                let msg = list.get(i);
                if (msg.get('uuid') === localUUID) {
                  list = list.set(i, msg.merge(immutable.fromJS(pkg)));
                  break;
                }
              }
            } else {
              console.error(
                'update msglist failed, not find msgList in',
                converseUUID
              );
            }

            return list;
          }
        );
      }
      case SWITCH_GROUP:
        return state.setIn(['converses', action.payload, 'unread'], false);
      case CREATE_CONVERSES_SUCCESS: {
        let createConvUUID = action.payload.uuid;
        let createConv = Object.assign(
          {},
          {
            msgList: [],
            lastMsg: '',
            lastTime: '',
          },
          action.payload
        );
        return state.setIn(
          ['converses', createConvUUID],
          immutable.fromJS(createConv)
        );
      }
      case UPDATE_SYSTEM_CARD_CHAT_DATA:
        return state.updateIn(
          ['converses', 'trpgsystem', 'msgList'],
          (list) => {
            for (var i = 0; i < list.size; i++) {
              if (list.getIn([i, 'uuid']) === action.chatUUID) {
                list = list.set(i, immutable.fromJS(action.payload));
              }
            }

            return list;
          }
        );
      case UPDATE_WRITING_STATUS: {
        const { type = 'user', isWriting = false, uuid } = action.payload;
        if (type === 'user') {
          // 处理用户的正在写信息
          return state.updateIn(['writingList', 'user'], (list) => {
            if (isWriting) {
              return list.push(uuid);
            } else {
              return list.delete(list.findIndex((item) => item === uuid));
            }
          });
        }

        // TODO: 团正在输入待实现
        break;
      }
      case UPDATE_USER_CHAT_EMOTION_CATALOG: {
        const catalogs = action.payload;
        return state.setIn(
          ['emotions', 'catalogs'],
          immutable.fromJS(catalogs)
        );
      }
      case ADD_USER_CHAT_EMOTION_CATALOG: {
        const catalog = action.payload;
        return state.updateIn(['emotions', 'catalogs'], (list) => {
          for (let i = 0; i < list.size; i++) {
            if (list.getIn([i, 'uuid']) === catalog.uuid) {
              console.log('该表情包已添加');
              return list;
            }
          }

          return list.push(immutable.fromJS(catalog));
        });
      }
      default:
        return state;
    }
  } catch (e) {
    console.error(e);
    return state;
  }
}
