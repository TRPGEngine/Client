import immutable, { Record, Map, List } from 'immutable';
import constants from '../constants';
const {
  RESET,
  CREATE_GROUP_SUCCESS,
  GET_GROUP_INFO_SUCCESS,
  UPDATE_GROUP_INFO_SUCCESS,
  FIND_GROUP_REQUEST,
  FIND_GROUP_SUCCESS,
  REQUEST_JOIN_GROUP_SUCCESS,
  ADD_GROUP_SUCCESS,
  AGREE_GROUP_REQUEST_SUCCESS,
  // SEND_GROUP_INVITE_SUCCESS,
  AGREE_GROUP_INVITE_SUCCESS,
  REFUSE_GROUP_INVITE_SUCCESS,
  GET_GROUP_INVITE_SUCCESS,
  GET_GROUP_LIST_SUCCESS,
  SWITCH_GROUP,
  GET_GROUP_ACTOR_SUCCESS,
  GET_GROUP_MEMBERS_SUCCESS,
  SET_PLAYER_SELECTED_GROUP_ACTOR_SUCCESS,
  ADD_GROUP_ACTOR_SUCCESS,
  REMOVE_GROUP_ACTOR_SUCCESS,
  AGREE_GROUP_ACTOR_SUCCESS,
  REFUSE_GROUP_ACTOR_SUCCESS,
  UPDATE_GROUP_ACTOR_INFO_SUCCESS,
  QUIT_GROUP_SUCCESS,
  DISMISS_GROUP_SUCCESS,
  TICK_MEMBER_SUCCESS,
  SET_MEMBER_TO_MANAGER_SUCCESS,
  UPDATE_GROUP_STATUS,
} = constants;

export type GroupState = Record<{
  info: Map<string, any>;
  invites: List<any>;
  groups: List<any>;
  selectedGroupUUID: string;
  isFindingGroup: boolean;
  findingResult: List<any>;
  requestingGroupUUID: List<string>;
  groupActorMap: Map<string, Map<string, string>>;
}>;

const initialState: GroupState = immutable.fromJS({
  info: {}, // 所有的group信息。包括加入的和未加入的 // TODO: 修改到cache里管理
  invites: [], // 邀请列表。里面是邀请对象
  groups: [], // 个人所有组的信息
  selectedGroupUUID: '',
  isFindingGroup: false,
  findingResult: [],
  requestingGroupUUID: [],
  groupActorMap: {}, // {groupUUID: {userUUID: groupActorUUID}} 如果为自己，可以使用self代替userUUID
});

export default function group(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case CREATE_GROUP_SUCCESS:
      return state.update('groups', (list) =>
        list.push(immutable.fromJS(action.payload))
      );
    case GET_GROUP_INFO_SUCCESS: {
      let group_uuid = action.payload.uuid;
      return state.setIn(['info', group_uuid], action.payload);
    }
    case UPDATE_GROUP_INFO_SUCCESS: {
      let groupIndex = state
        .get('groups')
        .findIndex((i) => i.get('uuid') === action.payload.uuid);
      if (groupIndex >= 0) {
        let info = state.getIn(['groups', groupIndex]).toJS();
        info = Object.assign({}, info, action.payload);
        return state.setIn(['groups', groupIndex], immutable.fromJS(info));
      }
      return state;
    }
    case FIND_GROUP_REQUEST:
      return state.set('isFindingGroup', true);
    case FIND_GROUP_SUCCESS:
      return state
        .set('isFindingGroup', false)
        .set('findingResult', immutable.fromJS(action.payload));
    case REQUEST_JOIN_GROUP_SUCCESS:
      return state.update('requestingGroupUUID', (l) =>
        l.push(action.payload.group_uuid)
      );
    case ADD_GROUP_SUCCESS: {
      let payload = action.payload;
      if (
        state.get('groups').findIndex((l) => l.get('uuid') === payload.uuid) >=
        0
      ) {
        // 已存在, 不处理
        return state;
      } else {
        return state.update('groups', (l) => l.push(immutable.fromJS(payload)));
      }
    }
    case AGREE_GROUP_REQUEST_SUCCESS:
      return state.update('groups', (list) => {
        for (let i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            list = list.setIn(
              [i, 'group_members'],
              immutable.fromJS(action.payload)
            );
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
          if (item.get('uuid') === agreeUUID) {
            index = i;
            break;
          }
        }

        if (index >= 0) {
          return list.delete(index);
        } else {
          return list;
        }
      });
    case REFUSE_GROUP_INVITE_SUCCESS:
      return state.update('invites', (list) => {
        // same as agree
        let agreeUUID = action.payload.uuid;
        let index = -1;
        for (let i = 0; i < list.size; i++) {
          let item = list.get(i);
          if (item.get('uuid') === agreeUUID) {
            index = i;
            break;
          }
        }

        if (index >= 0) {
          return list.delete(index);
        } else {
          return list;
        }
      });
    case GET_GROUP_LIST_SUCCESS:
      return state.set('groups', immutable.fromJS(action.payload));
    case SWITCH_GROUP:
      return state.set('selectedGroupUUID', action.payload);
    case GET_GROUP_ACTOR_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            list = list.setIn(
              [i, 'group_actors'],
              immutable.fromJS(action.payload)
            );
          }
        }

        return list;
      });
    case GET_GROUP_MEMBERS_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            list = list.setIn(
              [i, 'group_members'],
              immutable.fromJS(action.payload)
            );
          }
        }

        return list;
      });
    case SET_PLAYER_SELECTED_GROUP_ACTOR_SUCCESS: {
      const { groupUUID, groupActorUUID } = action.payload;
      return state
        .update('groups', (list) => {
          for (var i = 0; i < list.size; i++) {
            if (list.getIn([i, 'uuid']) === groupUUID) {
              list = list.setIn(
                [i, 'extra', 'selected_group_actor_uuid'],
                groupActorUUID
              );
              break;
            }
          }

          return list;
        })
        .setIn(['groupActorMap', groupUUID, 'self'], groupActorUUID);
    }
    case ADD_GROUP_ACTOR_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            list = list.updateIn([i, 'group_actors'], (i) =>
              i.push(immutable.fromJS(action.payload))
            );
          }
        }

        return list;
      });
    case REMOVE_GROUP_ACTOR_SUCCESS: {
      let groupIndex = state
        .get('groups')
        .findIndex((i) => i.get('uuid') === action.groupUUID);
      if (groupIndex >= 0) {
        return state.updateIn(
          ['groups', groupIndex, 'group_actors'],
          (gaList) => {
            let groupActorIndex = gaList.findIndex(
              (ga) => ga.get('uuid') === action.groupActorUUID
            );
            if (groupIndex >= 0) {
              return gaList.remove(groupActorIndex);
            }
            return gaList;
          }
        );
      }

      return state;
    }
    case AGREE_GROUP_ACTOR_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            let groupActorUUID = action.payload.uuid;
            list = list.updateIn([i, 'group_actors'], (_list) => {
              let _index = list.findIndex(
                (_item) => _item.uuid === groupActorUUID
              );
              return _list.setIn([_index, 'passed'], true);
            });
          }
        }

        return list;
      });
    case REFUSE_GROUP_ACTOR_SUCCESS:
      return state.update('groups', (list) => {
        for (var i = 0; i < list.size; i++) {
          if (list.getIn([i, 'uuid']) === action.groupUUID) {
            let groupActorUUID = action.groupActorUUID;
            list = list.updateIn([i, 'group_actors'], (_list) => {
              let _index = list.findIndex(
                (_item) => _item.uuid === groupActorUUID
              );
              return _list.delete(_index);
            });
          }
        }

        return list;
      });
    case UPDATE_GROUP_ACTOR_INFO_SUCCESS: {
      let groupIndex = state
        .get('groups')
        .findIndex((i) => i.uuid === action.groupUUID);
      let groupActorIndex = state
        .getIn(['groups', groupIndex, 'group_actors'])
        .findIndex((i) => i.uuid === action.groupActorUUID);
      return state.setIn(
        ['groups', groupIndex, 'group_actors', groupActorIndex, 'actor_info'],
        immutable.fromJS(action.groupActorInfo)
      );
    }
    case QUIT_GROUP_SUCCESS:
    case DISMISS_GROUP_SUCCESS:
      return state.update('groups', (list) => {
        let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
        return list.delete(index);
      });
    case TICK_MEMBER_SUCCESS:
      return state.update('groups', (list) => {
        let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
        return list.updateIn([index, 'group_members'], (gml) => {
          return gml.delete(gml.findIndex((i) => i === action.memberUUID));
        });
      });
    case SET_MEMBER_TO_MANAGER_SUCCESS:
      return state.update('groups', (list) => {
        let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
        return list.updateIn([index, 'managers_uuid'], (list) =>
          list.push(action.memberUUID)
        );
      });
    case UPDATE_GROUP_STATUS:
      return state.update('groups', (list) => {
        let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
        return list.setIn([index, 'status'], action.groupStatus);
      });
    default:
      return state;
  }
}
