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
  ADD_GROUP_ACTOR,
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
    case GET_GROUP_INFO_SUCCESS: {
      const groupUUID = action.payload.uuid;
      draft.info[groupUUID] = {
        ...draft.info[groupUUID],
        ...action.payload,
      };
      return;
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
    }
    case FIND_GROUP_REQUEST:
      draft.isFindingGroup = true;
      return;
    case FIND_GROUP_SUCCESS:
      draft.isFindingGroup = false;
      draft.findingResult = action.payload;
      return;
    case REQUEST_JOIN_GROUP_SUCCESS:
      draft.requestingGroupUUID.push(action.payload.group_uuid);
      return;
    case ADD_GROUP_SUCCESS: {
      const payload = action.payload;
      const groupIndex = draft.groups.findIndex((g) => g.uuid === payload.uuid);
      if (groupIndex === -1) {
        draft.groups.push(payload);
      }
      return;
    }
    case AGREE_GROUP_REQUEST_SUCCESS:
      const group = draft.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      if (!_isNil(group)) {
        group.group_members = action.payload || [];
      }
      return;
    case GET_GROUP_INVITE_SUCCESS:
      draft.invites = action.payload;
      return;
    case AGREE_GROUP_INVITE_SUCCESS: {
      const agreeUUID = action.payload.uuid;
      _remove(draft.invites, (invite) => invite.uuid === agreeUUID);
      return;
    }
    case REFUSE_GROUP_INVITE_SUCCESS:
      const refuseUUID = action.payload.uuid;
      _remove(draft.invites, (invite) => invite.uuid === refuseUUID);
      return;
    case GET_GROUP_LIST_SUCCESS:
      draft.groups = action.payload ?? [];
      return;
    case SWITCH_GROUP:
      draft.selectedGroupUUID = action.payload;
      return;
    case GET_GROUP_ACTOR_SUCCESS: {
      const index = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        draft.groups[index].group_actors = action.payload;
      }

      return;
    }
    case GET_GROUP_MEMBERS_SUCCESS: {
      const index = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        draft.groups[index].group_members = action.payload;
      }

      return;
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
    }
    case UPDATE_PLAYER_SELECTED_GROUP_ACTOR: {
      const { groupUUID, userUUID, groupActorUUID } = action.payload;
      _set(draft.groupActorMap, [groupUUID, userUUID], groupActorUUID);
      return;
    }
    case ADD_GROUP_ACTOR: {
      if (_isNil(action.payload)) {
        return;
      }

      const index = draft.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        draft.groups[index].group_actors.push(action.payload);
      }
      return;
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
    }
    case QUIT_GROUP_SUCCESS:
    case DISMISS_GROUP_SUCCESS:
      _remove(draft.groups, (group) => group.uuid === action.groupUUID);
      return;
    case TICK_MEMBER_SUCCESS: {
      const group = draft.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      if (!_isNil(group)) {
        _remove(group.group_members, (member) => member === action.memberUUID);
      }
      return;
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
    }
    case SET_MEMBER_TO_MANAGER_SUCCESS: {
      const group = draft.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      group.managers_uuid.push(action.memberUUID);
      return;
    }

    case UPDATE_GROUP_STATUS: {
      const group = draft.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      group.status = action.groupStatus;
      return;
    }
  }
}, initialState);
