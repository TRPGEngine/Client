const immutable = require('immutable');

const initialState = immutable.fromJS({
  converses: {
    "welcomeConverses": {
      uuid: 'welcomeConverses',
      name: '系统',
      icon: '',
      lastMsg: '欢迎使用TPRG客户端',
      lastTime: new Date().Format("yyyy-MM-dd HH:mm:ss"),
      msgList: [
        {
          uuid: 'welcomeMessage',
          sender: '系统',
          time: new Date().Format("yyyy-MM-dd HH:mm:ss"),
          content: '欢迎使用TPRG客户端',
        }
      ]
    }
  }
});

module.exports = function chat(state = initialState, action) {
  try {
    switch (action.type) {
      case 'ADD_CONVERSES':
        let uuid = action.payload.get('uuid');
        if(!state.getIn(['converses', uuid])) {
          return state.setIn(['converses', uuid], action.payload);
        }else {
          // 如果有会话了直接返回
          return state;
        }
      case 'ADD_MSG':
        let converseUUID = action.converseUUID;
        if(!state.getIn(['converses', converseUUID])) {
          console.log(state.getIn(['converses', converseUUID]));
          console.warn('add msg failed: this converses is not exist', converseUUID);
          return state;
        }

        return state.updateIn(
          ['converses', converseUUID, 'msgList'],
          (msgList) => msgList.push(action.payload)
        );
      default:
        return state;
    }
  } catch (e) {
    console.error(e);
    return state;
  }
}
