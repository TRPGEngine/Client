const {
  ADD_CONVERSES,
  ADD_MSG,
  GET_CONVERSES_REQUEST,
  GET_CONVERSES_SUCCESS,
  GET_CONVERSES_FAILED,
  UPDATE_CONVERSES,
  SWITCH_CONVERSES,
} = require('../constants');
const immutable = require('immutable');
const moment = require('moment');

const initialState = immutable.fromJS({
  selectedConversesUUID: '',
  converses: {
    "systemUUID": {
      uuid: 'systemUUID',
      type: 'user',
      name: '系统',
      icon: '',
      lastMsg: '欢迎使用TPRG客户端',
      lastTime: moment().format('HH:mm'),
      msgList: [
        {
          room: '',
          uuid: 'welcomeMessage',
          sender: '系统',
          sender_uuid: 'systemUUID',
          to_uuid: '',
          type: 'normal',
          is_public: false,
          time: moment().format('HH:mm'),
          message: '欢迎使用TPRG客户端',
          date: moment().valueOf()
        }
      ]
    }
  }
});

module.exports = function chat(state = initialState, action) {
  try {
    let payload;
    switch (action.type) {
      case ADD_CONVERSES:
        let uuid = action.payload.get('uuid');
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
          .setIn(['converses', converseUUID, 'lastTime'], moment(payload.get('date')).format('HH:mm'));;
      case GET_CONVERSES_SUCCESS:
        let list = action.payload;
        if(list instanceof Array && list.length > 0) {
          let converses = {};
          for (var i = 0; i < list.length; i++) {
            let item = list[i];
            let uuid = item.uuid;
            converses[uuid] = Object.assign({}, {
              msgList:[],
              lastMsg: '',
              lastTime: '',
            }, item);
          }
          return state.setIn(['converses'], immutable.fromJS(converses));
        }
        return state;
      case UPDATE_CONVERSES:
        let convUUID = action.convUUID;
        payload = immutable.fromJS(action.payload);
        let lastLog = payload.last();
        return state.updateIn(['converses', convUUID, 'msgList'], (list) => list.concat(payload))
          .setIn(['converses', convUUID, 'lastMsg'], lastLog.get('message'))
          .setIn(['converses', convUUID, 'lastTime'], moment(lastLog.get('date')).format('HH:mm'));
      case SWITCH_CONVERSES:
        return state.set('selectedConversesUUID', action.converseUUID);
      default:
        return state;
    }
  } catch (e) {
    console.error(e);
    return state;
  }
}
