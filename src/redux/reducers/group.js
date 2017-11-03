const immutable = require('immutable');
const {
  GET_GROUP_INFO_SUCCESS,
  SEND_GROUP_INVITE_SUCCESS,
  AGREE_GROUP_INVITE_SUCCESS,
  REFUSE_GROUP_INVITE_SUCCESS,
  GET_GROUP_INVITE_SUCCESS,
  GET_GROUP_LIST_SUCCESS,
  SWITCH_GROUP,
  GET_GROUP_ACTOR_SUCCESS,
  GET_GROUP_MEMBERS_SUCCESS,
  SET_PLAYER_SELECTED_GROUP_ACTOR_SUCCESS,
  ADD_GROUP_ACTOR_SUCCESS,
} = require('../constants');

const initialState = immutable.fromJS({
  info: {},// 所有的group信息。包括加入的和未加入的
  invites: [],// 邀请列表。里面是邀请对象
  groups: [],// 个人所有组的信息
  selectedGroupUUID: '',
});

module.exports = function group(state = initialState, action) {
  switch (action.type) {
    case GET_GROUP_INFO_SUCCESS:
      let group_uuid = action.payload.uuid;
      return state.setIn(['info', group_uuid], action.payload);
    case GET_GROUP_INVITE_SUCCESS:
      return state.set('invites', immutable.fromJS(action.payload));
    case AGREE_GROUP_INVITE_SUCCESS:
      return state.update('invites', (list) => {
        let agreeUUID = action.payload.uuid;
        let index = -1;
        for (let i = 0; i < list.size; i++) {
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
      }).update('groups', (list) => list.push(immutable.fromJS(action.payload.group)));
    case REFUSE_GROUP_INVITE_SUCCESS:
      return state.update('invites', (list) => {
        // same as agree
        let agreeUUID = action.payload.uuid;
        let index = -1;
        for (let i = 0; i < list.size; i++) {
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
    case GET_GROUP_LIST_SUCCESS:
      return state.set('groups', immutable.fromJS(action.payload));
    case SWITCH_GROUP:
      return state.set('selectedGroupUUID', action.payload);
    case GET_GROUP_ACTOR_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            list = list.setIn([i, 'group_actors'], immutable.fromJS(action.payload));
          }
        }

        return list;
      })
    case GET_GROUP_MEMBERS_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            list = list.setIn([i, 'group_members'], immutable.fromJS(action.payload));
          }
        }

        return list;
      })
    case SET_PLAYER_SELECTED_GROUP_ACTOR_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.payload.groupUUID) {
            list = list.setIn([i, 'extra', 'selected_group_actor_uuid'], action.payload.groupActorUUID);
          }
        }

        return list;
      })
    case ADD_GROUP_ACTOR_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            list = list.updateIn([i, 'group_actors'], (i) => i.push(immutable.fromJS(action.payload)));
          }
        }

        return list;
      })
    default:
      return state;
  }

  return state;
}
