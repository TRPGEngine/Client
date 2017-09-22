const immutable = require('immutable');
const {
  GET_GROUP_INFO_SUCCESS,
  SEND_GROUP_INVITE_SUCCESS,
  AGREE_GROUP_INVITE_SUCCESS,
  REFUSE_GROUP_INVITE_SUCCESS,
  GET_GROUP_INVITE_SUCCESS,
} = require('../constants');

const initialState = immutable.fromJS({
  list: [],// 加入的组列表。uuid
  info: {},// 所有的group信息。包括加入的和未加入的
  invites: [],// 邀请列表。里面是邀请对象
});

module.exports = function group(state = initialState, action) {
  switch (action.type) {
    case GET_GROUP_INFO_SUCCESS:
      let group_uuid = action.payload.uuid;
      return state.setIn(['info', group_uuid], action.payload);
    case GET_GROUP_INVITE_SUCCESS:
      return state.set('invites', action.payload);
    case AGREE_GROUP_INVITE_SUCCESS:
      return state.update('invites', (list) => {
        let agreeUUID = action.payload.uuid;
        let index = -1;
        for (let i = 0; i < list.count(); i++) {
          let item = list.get(i);
          if(item.get('uuid') === agreeUUID) {
            index = i;
            break;
          }
        }

        if(index >= 0) {
          return list.delete(index);
        }else {
          return list;
        }
      }).update('list', (list) => list.push(action.payload.group_uuid));
    case REFUSE_GROUP_INVITE_SUCCESS:
      return state.update('invites', (list) => {
        // same as agree
        let agreeUUID = action.payload.uuid;
        let index = -1;
        for (let i = 0; i < list.count(); i++) {
          let item = list.get(i);
          if(item.get('uuid') === agreeUUID) {
            index = i;
            break;
          }
        }

        if(index >= 0) {
          return list.delete(index);
        }else {
          return list;
        }
      })
  }

  return state;
}
