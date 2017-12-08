const {
  RESET,
  ADD_CONVERSES,
  ADD_MSG,
  UPDATE_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_CONVERSES_FAILED,
  CREATE_CONVERSES_REQUEST,
  CREATE_CONVERSES_SUCCESS,
  CREATE_CONVERSES_FAILED,
  UPDATE_CONVERSES_SUCCESS,
  SWITCH_CONVERSES,
  UPDATE_SYSTEM_CARD_CHAT_DATA,
} = require('../constants');
const immutable = require('immutable');

const initialState = immutable.fromJS({
  selectedConversesUUID: '',
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
  }
});

module.exports = function chat(state = initialState, action) {
  try {
    let payload;
    switch (action.type) {
      case RESET:
        return initialState;
      case ADD_CONVERSES:
        let uuid = action.payload.uuid;
        if(!state.getIn(['converses', uuid])) {
          return state.setIn(['converses', uuid], immutable.fromJS(action.payload));
        }else {
          // 如果有会话了直接返回
          return state;
        }
      case ADD_MSG:
        let converseUUID = action.converseUUID;
        if(!state.getIn(['converses', converseUUID])) {
          console.warn('add msg failed: this converses is not exist', converseUUID);
          return state;
        }
        payload = immutable.fromJS(action.payload)

        return state.updateIn(
            ['converses', converseUUID, 'msgList'],
            (msgList) => msgList.push(payload)
          ).setIn(['converses', converseUUID, 'lastMsg'], payload.get('message'))
          .setIn(['converses', converseUUID, 'lastTime'], payload.get('date'));
      case UPDATE_MSG:
        return state.updateIn(['converses', action.converseUUID, 'msgList'], (msgList) => {
          for (var i = 0; i < msgList.size; i++) {
            let msg = msgList.get(i);
            if(msg.get('uuid') === action.msgUUID) {
              msgList = msgList.set(i, immutable.fromJS(action.payload));
              break;
            }
          }

          return msgList;
        })
      case GET_CONVERSES_SUCCESS:
        let list = action.payload;
        if(list instanceof Array && list.length > 0) {
          let converses = state.get('converses');
          for (var i = 0; i < list.length; i++) {
            let item = list[i];
            let uuid = item.uuid;
            let obj = Object.assign({}, {
              msgList:[],
              lastMsg: '',
              lastTime: '',
            }, item);
            converses = converses.set(uuid, immutable.fromJS(obj));
          }
          return state.setIn(['converses'], converses);
        }
        return state;
      case UPDATE_CONVERSES_SUCCESS:
        let convUUID = action.convUUID;
        payload = immutable.fromJS(action.payload);
        if(payload.size > 0) {
          let lastLog = payload.last();
          return state.updateIn(['converses', convUUID, 'msgList'], (list) => list.concat(payload))
            .setIn(['converses', convUUID, 'lastMsg'], lastLog.get('message'))
            .setIn(['converses', convUUID, 'lastTime'], lastLog.get('date'));
        }else {
          return state;
        }
      case SWITCH_CONVERSES:
        return state.set('selectedConversesUUID', action.converseUUID);
      case CREATE_CONVERSES_SUCCESS:
        let createConvUUID = action.payload.uuid;
        let createConv = Object.assign({}, {
          msgList: [],
          lastMsg: '',
          lastTime: '',
        }, action.payload);
        return state.setIn(['converses', createConvUUID], immutable.fromJS(createConv));
      case UPDATE_SYSTEM_CARD_CHAT_DATA:
        return state.updateIn(['converses', 'trpgsystem', 'msgList'], (list) => {
          for (var i = 0; i < list.size; i++) {
            let msg = list.get(i);
            if(msg.get('uuid') === action.chatUUID) {
              msg = msg.set('data', immutable.fromJS(action.payload))
            }
          }

          return list;
        })
      default:
        return state;
    }
  } catch (e) {
    console.error(e);
    return state;
  }
}
