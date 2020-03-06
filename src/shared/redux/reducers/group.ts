import _get from 'lodash/get';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';
import _remove from 'lodash/remove';
import { GroupState } from '@redux/types/group';
import constants from '@redux/constants';
import produce from 'immer';
const {
  RESET,
  CREATE_GROUP_SUCCESS,
  GET_GROUP_INFO_SUCCESS,
  UPDATE_GROUP_INFO,
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
  UPDATE_PLAYER_SELECTED_GROUP_ACTOR,
  ADD_GROUP_ACTOR_SUCCESS,
  REMOVE_GROUP_ACTOR_SUCCESS,
  AGREE_GROUP_ACTOR_SUCCESS,
  REFUSE_GROUP_ACTOR_SUCCESS,
  UPDATE_GROUP_ACTOR_INFO,
  UPDATE_GROUP_ACTOR,
  UPDATE_GROUP_ACTOR_MAPPING,
  QUIT_GROUP_SUCCESS,
  DISMISS_GROUP_SUCCESS,
  TICK_MEMBER_SUCCESS,
  ADD_GROUP_MEMBER,
  REMOVE_GROUP_MEMBER,
  SET_MEMBER_TO_MANAGER_SUCCESS,
  UPDATE_GROUP_STATUS,
} = constants;

const initialState: GroupState = {
  info: {}, // 所有的group信息。包括加入的和未加入的 // TODO: 修改到cache里管理
  invites: [], // 邀请列表。里面是邀请对象
  groups: [], // 个人所有组的信息
  selectedGroupUUID: '',
  isFindingGroup: false,
  findingResult: [],
  requestingGroupUUID: [],

  // TODO: 需要在登录后获取团所有成员映射
  groupActorMap: {}, // {groupUUID: {userUUID: groupActorUUID}} 如果为自己，可以使用self代替userUUID
};

export default produce((draft: GroupState, action) => {
  switch (action.type) {
    case RESET:
      return initialState;
    case CREATE_GROUP_SUCCESS:
      if (
        draft.groups.findIndex(
          (g) => g.uuid === _get(action.payload, 'uuid', '')
        ) === -1
      ) {
        draft.groups.push(action.payload);
      }
      return;
    // return state.update('groups', (list) => {
    //   const groupIndex = list.findIndex(
    //     (g) => g.get('uuid') === _get(action.payload, 'uuid', '')
    //   );
    //   if (groupIndex === -1) {
    //     list = list.push(immutable.fromJS(action.payload));
    //   }

    //   return list;
    // });
    case GET_GROUP_INFO_SUCCESS: {
      const groupUUID = action.payload.uuid;
      draft.info[groupUUID] = {
        ...draft.info[groupUUID],
        ...action.payload,
      };
      return;

      // return state.mergeIn(['info', groupUUID], fromJS(action.payload)); // 合并
    }
    case UPDATE_GROUP_INFO: {
      const groupIndex = draft.groups.findIndex(
        (i) => i.uuid === action.payload.uuid
      );
      if (groupIndex >= 0) {
        draft.groups[groupIndex] = {
          ...draft.groups[groupIndex],
          ...action.payload,
        };
      }
      return;

      // const groupIndex = state
      //   .get('groups')
      //   .findIndex((i) => i.get('uuid') === action.payload.uuid);
      // if (groupIndex >= 0) {
      //   let info = state.getIn(['groups', groupIndex]).toJS();
      //   info = Object.assign({}, info, action.payload);
      //   return state.setIn(['groups', groupIndex], immutable.fromJS(info));
      // }
      // return state;
    }
    case FIND_GROUP_REQUEST:
      draft.isFindingGroup = true;
      return;
    // return state.set('isFindingGroup', true);
    case FIND_GROUP_SUCCESS:
      draft.isFindingGroup = false;
      draft.findingResult = action.payload;
      return;
    // return state
    //   .set('isFindingGroup', false)
    //   .set('findingResult', immutable.fromJS(action.payload));
    case REQUEST_JOIN_GROUP_SUCCESS:
      draft.requestingGroupUUID.push(action.payload.group_uuid);
      return;
    // return state.update('requestingGroupUUID', (l) =>
    //   l.push(action.payload.group_uuid)
    // );
    case ADD_GROUP_SUCCESS: {
      const payload = action.payload;
      const groupIndex = draft.groups.findIndex((g) => g.uuid === payload.uuid);
      if (groupIndex === -1) {
        draft.groups.push(payload);
      }
      return;

      // if (
      //   state.get('groups').findIndex((l) => l.get('uuid') === payload.uuid) >=
      //   0
      // ) {
      //   // 已存在, 不处理
      //   return state;
      // } else {
      //   return state.update('groups', (l) => l.push(immutable.fromJS(payload)));
      // }
    }
    case AGREE_GROUP_REQUEST_SUCCESS:
      const group = draft.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      if (!_isNil(group)) {
        group.group_members = action.payload || [];
      }
      return;

    // return state.update('groups', (list) => {
    //   for (let i = 0; i < list.size; i++) {
    //     if (list.getIn([i, 'uuid']) === action.groupUUID) {
    //       list = list.setIn(
    //         [i, 'group_members'],
    //         immutable.fromJS(action.payload || [])
    //       );
    //     }
    //   }

    //   return list;
    // });
    case GET_GROUP_INVITE_SUCCESS:
      draft.invites = action.payload;
      return;
    // return state.set('invites', immutable.fromJS(action.payload));
    case AGREE_GROUP_INVITE_SUCCESS: {
      const agreeUUID = action.payload.uuid;
      _remove(draft.invites, (invite) => invite.uuid === agreeUUID);
      return;

      // return state.update('invites', (list) => {
      //   let agreeUUID = action.payload.uuid;
      //   let index = -1;
      //   for (let i = 0; i < list.size; i++) {
      //     let item = list.get(i);
      //     if (item.get('uuid') === agreeUUID) {
      //       index = i;
      //       break;
      //     }
      //   }

      //   if (index >= 0) {
      //     return list.delete(index);
      //   } else {
      //     return list;
      //   }
      // });
    }
    case REFUSE_GROUP_INVITE_SUCCESS:
      const refuseUUID = action.payload.uuid;
      _remove(draft.invites, (invite) => invite.uuid === refuseUUID);
      return;

    // return state.update('invites', (list) => {
    //   // same as agree
    //   let agreeUUID = action.payload.uuid;
    //   let index = -1;
    //   for (let i = 0; i < list.size; i++) {
    //     let item = list.get(i);
    //     if (item.get('uuid') === agreeUUID) {
    //       index = i;
    //       break;
    //     }
    //   }

    //   if (index >= 0) {
    //     return list.delete(index);
    //   } else {
    //     return list;
    //   }
    // });
    case GET_GROUP_LIST_SUCCESS:
      draft.groups = action.payload ?? [];
      return;
    // return state.set('groups', immutable.fromJS(action.payload));
    case SWITCH_GROUP:
      draft.selectedGroupUUID = action.payload;
      return;
    // return state.set('selectedGroupUUID', action.payload);
    case GET_GROUP_ACTOR_SUCCESS: {
      const index = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        draft.groups[index].group_actors = action.payload;
      }

      return;

      // return state.update('groups', (list) => {
      //   for (var i = 0; i < list.size; i++) {
      //     if (list.getIn([i, 'uuid']) === action.groupUUID) {
      //       list = list.setIn(
      //         [i, 'group_actors'],
      //         immutable.fromJS(action.payload)
      //       );
      //     }
      //   }

      //   return list;
      // });
    }
    case GET_GROUP_MEMBERS_SUCCESS: {
      const index = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        draft.groups[index].group_members = action.payload;
      }

      return;

      // return state.update('groups', (list) => {
      //   for (var i = 0; i < list.size; i++) {
      //     if (list.getIn([i, 'uuid']) === action.groupUUID) {
      //       list = list.setIn(
      //         [i, 'group_members'],
      //         immutable.fromJS(action.payload || [])
      //       );
      //     }
      //   }

      //   return list;
      // });
    }
    case SET_PLAYER_SELECTED_GROUP_ACTOR_SUCCESS: {
      const { groupUUID, groupActorUUID } = action.payload;
      const index = draft.groups.findIndex((group) => group.uuid === groupUUID);
      if (index >= 0) {
        _set(
          draft.groups[index],
          'extra.selected_group_actor_uuid',
          groupActorUUID
        );
      }
      _set(draft.groupActorMap, [groupUUID, 'self'], groupActorUUID);
      return;

      // return state
      //   .update('groups', (list) => {
      //     for (var i = 0; i < list.size; i++) {
      //       if (list.getIn([i, 'uuid']) === groupUUID) {
      //         list = list.setIn(
      //           [i, 'extra', 'selected_group_actor_uuid'],
      //           groupActorUUID
      //         );
      //         break;
      //       }
      //     }

      //     return list;
      //   })
      //   .setIn(['groupActorMap', groupUUID, 'self'], groupActorUUID);
    }
    case UPDATE_PLAYER_SELECTED_GROUP_ACTOR: {
      const { groupUUID, userUUID, groupActorUUID } = action.payload;
      _set(draft.groupActorMap, [groupUUID, userUUID], groupActorUUID);
      return;
      // return state.setIn(
      //   ['groupActorMap', groupUUID, userUUID],
      //   groupActorUUID
      // );
    }
    case ADD_GROUP_ACTOR_SUCCESS: {
      const index = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        draft.groups[index].group_actors.push(action.payload);
      }
      return;

      // return state.update('groups', (list) => {
      //   for (var i = 0; i < list.size; i++) {
      //     if (list.getIn([i, 'uuid']) === action.groupUUID) {
      //       list = list.updateIn([i, 'group_actors'], (i) =>
      //         i.push(immutable.fromJS(action.payload))
      //       );
      //     }
      //   }

      //   return list;
      // });
    }
    case REMOVE_GROUP_ACTOR_SUCCESS: {
      const groupIndex = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (groupIndex >= 0) {
        const group_actors = draft.groups[groupIndex].group_actors;
        _remove(group_actors, (ga) => ga.uuid === action.groupActorUUID);
      }
      return;

      // let groupIndex = state
      //   .get('groups')
      //   .findIndex((i) => i.get('uuid') === action.groupUUID);
      // if (groupIndex >= 0) {
      //   return state.updateIn(
      //     ['groups', groupIndex, 'group_actors'],
      //     (gaList) => {
      //       let groupActorIndex = gaList.findIndex(
      //         (ga) => ga.get('uuid') === action.groupActorUUID
      //       );
      //       if (groupIndex >= 0) {
      //         return gaList.remove(groupActorIndex);
      //       }
      //       return gaList;
      //     }
      //   );
      // }

      // return state;
    }
    case AGREE_GROUP_ACTOR_SUCCESS: {
      const index = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        const groupActorUUID = action.payload.uuid;
        const groupActorIndex = draft.groups[index].group_actors.findIndex(
          (item) => item.uuid === groupActorUUID
        );
        if (groupActorIndex >= 0) {
          draft.groups[index].group_actors[groupActorIndex].passed = true;
        }
      }
      return;

      // return state.update('groups', (list) => {
      //   for (var i = 0; i < list.size; i++) {
      //     if (list.getIn([i, 'uuid']) === action.groupUUID) {
      //       let groupActorUUID = action.payload.uuid;
      //       list = list.updateIn([i, 'group_actors'], (_list) => {
      //         let _index = list.findIndex(
      //           (_item) => _item.get('uuid') === groupActorUUID
      //         );
      //         return _list.setIn([_index, 'passed'], true);
      //       });
      //     }
      //   }

      //   return list;
      // });
    }
    case REFUSE_GROUP_ACTOR_SUCCESS: {
      const index = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        const groupActorUUID = action.groupActorUUID;
        _remove(
          draft.groups[index].group_actors,
          (item) => item.uuid === groupActorUUID
        );
      }

      return;

      // return state.update('groups', (list) => {
      //   for (var i = 0; i < list.size; i++) {
      //     if (list.getIn([i, 'uuid']) === action.groupUUID) {
      //       let groupActorUUID = action.groupActorUUID;
      //       list = list.updateIn([i, 'group_actors'], (_list) => {
      //         let _index = list.findIndex(
      //           (_item) => _item.get('uuid') === groupActorUUID
      //         );
      //         return _list.delete(_index);
      //       });
      //     }
      //   }

      //   return list;
      // });
    }
    case UPDATE_GROUP_ACTOR_INFO: {
      const groupIndex = draft.groups.findIndex(
        (g) => g.uuid === action.groupUUID
      );
      if (groupIndex === -1) {
        return;
      }
      const groupActorIndex = draft.groups[groupIndex].group_actors.findIndex(
        (g) => g.uuid === action.groupActorUUID
      );

      if (groupActorIndex === -1) {
        return;
      }

      const groupActorInfo = action.groupActorInfo;
      _set(
        draft.groups[groupIndex],
        ['group_actors', groupActorIndex, 'actor_info'],
        groupActorInfo
      );
      if (!_isNil(groupActorInfo._name)) {
        _set(
          draft.groups[groupIndex],
          ['group_actors', groupActorIndex, 'name'],
          groupActorInfo._name
        );
      }
      if (!_isNil(groupActorInfo._desc)) {
        _set(
          draft.groups[groupIndex],
          ['group_actors', groupActorIndex, 'desc'],
          groupActorInfo._desc
        );
      }
      if (!_isNil(groupActorInfo._avatar)) {
        _set(
          draft.groups[groupIndex],
          ['group_actors', groupActorIndex, 'avatar'],
          groupActorInfo._avatar
        );
      }
      return;
    }
    case UPDATE_GROUP_ACTOR: {
      const groupIndex = draft.groups.findIndex(
        (g) => g.uuid === action.groupUUID
      );
      if (groupIndex === -1) {
        return;
      }
      const groupActorIndex = draft.groups[groupIndex].group_actors.findIndex(
        (ga) => ga.uuid === action.groupActor.uuid
      );

      if (groupActorIndex === -1) {
        return;
      }

      _set(
        draft.groups[groupIndex],
        ['group_actors', groupActorIndex],
        action.groupActor
      );
      return;
    }
    case UPDATE_GROUP_ACTOR_MAPPING: {
      draft.groupActorMap[action.groupUUID] = action.payload;
      return;
      // const groupUUID = action.groupUUID;
      // const payload = action.payload;

      // return state.setIn(['groupActorMap', groupUUID], fromJS(payload));
    }
    case QUIT_GROUP_SUCCESS:
    case DISMISS_GROUP_SUCCESS:
      _remove(draft.groups, (group) => group.uuid === action.groupUUID);
      return;

    // return state.update('groups', (list) => {
    //   let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
    //   return list.delete(index);
    // });
    case TICK_MEMBER_SUCCESS: {
      const group = draft.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      if (!_isNil(group)) {
        _remove(group.group_members, (member) => member === action.memberUUID);
      }
      return;

      // return state.update('groups', (list) => {
      //   let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
      //   return list.updateIn([index, 'group_members'], (gml) => {
      //     return gml.delete(gml.findIndex((i) => i === action.memberUUID));
      //   });
      // });
    }
    case ADD_GROUP_MEMBER: {
      const groupIndex = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      const groupMemberIndex = draft.groups[groupIndex].group_members.findIndex(
        (uuid) => uuid === action.memberUUID
      );
      if (groupMemberIndex === -1) {
        draft.groups[groupIndex].group_members.push(action.memberUUID);
      }
      return;

      // return state.update('groups', (list) => {
      //   let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
      //   return list.updateIn([index, 'group_members'], (gml: List<string>) => {
      //     const i = gml.findIndex((v) => v === action.memberUUID);
      //     if (i >= 0) {
      //       return gml;
      //     }
      //     return gml.push(action.memberUUID);
      //   });
      // });
    }
    case REMOVE_GROUP_MEMBER: {
      const groupIndex = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      _remove(
        draft.groups[groupIndex].group_members,
        (member) => member === action.memberUUID
      );
      return;

      // return state.update('groups', (list) => {
      //   let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
      //   return list.updateIn([index, 'group_members'], (gml: List<string>) => {
      //     const i = gml.findIndex((v) => v === action.memberUUID);
      //     if (i >= 0) {
      //       return gml.delete(i);
      //     }
      //     return gml;
      //   });
      // });
    }
    case SET_MEMBER_TO_MANAGER_SUCCESS: {
      const group = draft.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      group.managers_uuid.push(action.memberUUID);
      return;

      // return state.update('groups', (list) => {
      //   let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
      //   return list.updateIn([index, 'managers_uuid'], (list) =>
      //     list.push(action.memberUUID)
      //   );
      // });
    }

    case UPDATE_GROUP_STATUS: {
      const group = draft.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      group.status = action.groupStatus;
      return;

      // return state.update('groups', (list) => {
      //   let index = list.findIndex((i) => i.get('uuid') === action.groupUUID);
      //   return list.setIn([index, 'status'], action.groupStatus);
      // });
    }
  }
}, initialState);
