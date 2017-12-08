const immutable = require('immutable');
const {
  RESET,
  GET_GROUP_INFO_SUCCESS,
  FIND_GROUP_REQUEST,
  FIND_GROUP_SUCCESS,
  REQUEST_JOIN_GROUP_SUCCESS,
  AGREE_GROUP_REQUEST_SUCCESS,
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
  AGREE_GROUP_ACTOR_SUCCESS,
  REFUSE_GROUP_ACTOR_SUCCESS,
  QUIT_GROUP_SUCCESS,
  DISMISS_GROUP_SUCCESS,
} = require('../constants');

const initialState = immutable.fromJS({
  info: {},// 所有的group信息。包括加入的和未加入的
  invites: [],// 邀请列表。里面是邀请对象
  groups: [],// 个人所有组的信息
  selectedGroupUUID: '',
  isFindingGroup: false,
  findingResult: [],
  requestingGroupUUID: [],
});

module.exports = function group(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case GET_GROUP_INFO_SUCCESS:
      let group_uuid = action.payload.uuid;
      return state.setIn(['info', group_uuid], action.payload);
    case FIND_GROUP_REQUEST:
      return state.set('isFindingGroup', true);
    case FIND_GROUP_SUCCESS:
      return state.set('isFindingGroup', false).set('findingResult', immutable.fromJS(action.payload));
    case REQUEST_JOIN_GROUP_SUCCESS:
      return state.update('requestingGroupUUID', l => l.push(action.payload.group_uuid));
    case AGREE_GROUP_REQUEST_SUCCESS:
      return state.update('groups', (list) => {
        for (let i = 0; i < list.size; i++) {
          if(list.getIn([i, 'uuid']) === action.groupUUID) {
            list = list.setIn([i, 'group_members'], immutable.fromJS(action.payload));
          }
        }

        return list;
      });
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
    case AGREE_GROUP_ACTOR_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            let groupActorUUID = action.payload.uuid;
            list = list.updateIn([i, 'group_actors'], (_list) => {
              let _index = list.findIndex((_item) => _item.uuid === groupActorUUID);
              return _list.setIn([_index, 'passed'], true);
            });
          }
        }

        return list;
      })
    case REFUSE_GROUP_ACTOR_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            let groupActorUUID = action.groupActorUUID;
            list = list.updateIn([i, 'group_actors'], (_list) => {
              let _index = list.findIndex((_item) => _item.uuid === groupActorUUID);
              return _list.delete(_index);
            });
          }
        }

        return list;
      })
    case QUIT_GROUP_SUCCESS:
    case DISMISS_GROUP_SUCCESS:
      return state.update('groups', (list) => {
        let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
        return list.delete(index);
      })
    default:
      return state;
  }

  return state;
}
