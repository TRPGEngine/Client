import _get from 'lodash/get';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';
import _remove from 'lodash/remove';
import { GroupState } from '@redux/types/group';
import constants from '@redux/constants';
import produce from 'immer';
import { createReducer } from '@reduxjs/toolkit';
import {
  agreeGroupActor,
  refuseGroupActor,
  updateGroupActorInfo,
} from '@redux/actions/group';
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
  UPDATE_GROUP_MAP_LIST,
  ADD_GROUP_MAP,
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

export default createReducer(initialState, (builder) => {
  builder
    .addCase(RESET, (state) => {
      state = initialState;
    })
    .addCase(CREATE_GROUP_SUCCESS, (state, action: any) => {
      if (
        state.groups.findIndex(
          (g) => g.uuid === _get(action.payload, 'uuid', '')
        ) === -1
      ) {
        state.groups.push(action.payload);
      }
    })
    .addCase(GET_GROUP_INFO_SUCCESS, (state, action: any) => {
      const groupUUID = action.payload.uuid;
      state.info[groupUUID] = {
        ...state.info[groupUUID],
        ...action.payload,
      };
    })
    .addCase(UPDATE_GROUP_INFO, (state, action: any) => {
      const groupIndex = state.groups.findIndex(
        (i) => i.uuid === action.payload.uuid
      );
      if (groupIndex >= 0) {
        state.groups[groupIndex] = {
          ...state.groups[groupIndex],
          ...action.payload,
        };
      }
    })
    .addCase(FIND_GROUP_REQUEST, (state) => {
      state.isFindingGroup = true;
    })
    .addCase(FIND_GROUP_SUCCESS, (state, action: any) => {
      state.isFindingGroup = false;
      state.findingResult = action.payload;
    })
    .addCase(REQUEST_JOIN_GROUP_SUCCESS, (state, action: any) => {
      state.requestingGroupUUID.push(action.payload.group_uuid);
    })
    .addCase(ADD_GROUP_SUCCESS, (state, action: any) => {
      const payload = action.payload;
      const groupIndex = state.groups.findIndex((g) => g.uuid === payload.uuid);
      if (groupIndex === -1) {
        state.groups.push(payload);
      }
    })
    .addCase(AGREE_GROUP_REQUEST_SUCCESS, (state, action: any) => {
      const group = state.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      if (!_isNil(group)) {
        group.group_members = action.payload || [];
      }
    })
    .addCase(GET_GROUP_INVITE_SUCCESS, (state, action: any) => {
      state.invites = action.payload;
    })
    .addCase(AGREE_GROUP_INVITE_SUCCESS, (state, action: any) => {
      const agreeUUID = action.payload.uuid;
      _remove(state.invites, (invite) => invite.uuid === agreeUUID);
    })
    .addCase(REFUSE_GROUP_INVITE_SUCCESS, (state, action: any) => {
      const refuseUUID = action.payload.uuid;
      _remove(state.invites, (invite) => invite.uuid === refuseUUID);
    })
    .addCase(GET_GROUP_LIST_SUCCESS, (state, action: any) => {
      state.groups = action.payload ?? [];
    })
    .addCase(SWITCH_GROUP, (state, action: any) => {
      state.selectedGroupUUID = action.payload;
    })
    .addCase(GET_GROUP_ACTOR_SUCCESS, (state, action: any) => {
      const index = state.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        state.groups[index].group_actors = action.payload;
      }
    })
    .addCase(GET_GROUP_MEMBERS_SUCCESS, (state, action: any) => {
      const index = state.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        state.groups[index].group_members = action.payload;
      }
    })
    .addCase(SET_PLAYER_SELECTED_GROUP_ACTOR_SUCCESS, (state, action: any) => {
      const { groupUUID, groupActorUUID } = action.payload;
      const index = state.groups.findIndex((group) => group.uuid === groupUUID);
      if (index >= 0) {
        _set(
          state.groups[index],
          'extra.selected_group_actor_uuid',
          groupActorUUID
        );
      }
      _set(state.groupActorMap, [groupUUID, 'self'], groupActorUUID);
    })
    .addCase(UPDATE_PLAYER_SELECTED_GROUP_ACTOR, (state, action: any) => {
      const { groupUUID, userUUID, groupActorUUID } = action.payload;
      _set(state.groupActorMap, [groupUUID, userUUID], groupActorUUID);
      return;
    })
    .addCase(ADD_GROUP_ACTOR, (state, action: any) => {
      if (_isNil(action.payload)) {
        return;
      }

      const index = state.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (index >= 0) {
        state.groups[index].group_actors!.push(action.payload);
      }
    })
    .addCase(REMOVE_GROUP_ACTOR_SUCCESS, (state, action: any) => {
      const groupIndex = state.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (groupIndex >= 0) {
        const group_actors = state.groups[groupIndex].group_actors!;
        _remove(group_actors, (ga) => ga.uuid === action.groupActorUUID);
      }
    })
    .addCase(agreeGroupActor, (state, action) => {
      const { groupUUID, groupActor } = action.payload;
      const index = state.groups.findIndex((group) => group.uuid === groupUUID);

      if (index >= 0) {
        const groupActorUUID = groupActor.uuid;
        const groupActorIndex = state.groups[index].group_actors!.findIndex(
          (item) => item.uuid === groupActorUUID
        );
        if (groupActorIndex >= 0) {
          state.groups[index].group_actors![groupActorIndex].passed = true;
        }
      }
    })
    .addCase(refuseGroupActor, (state, action) => {
      const { groupUUID, groupActorUUID } = action.payload;
      const index = state.groups.findIndex((group) => group.uuid === groupUUID);
      if (index >= 0) {
        _remove(
          state.groups[index].group_actors!,
          (item) => item.uuid === groupActorUUID
        );
      }
    })
    .addCase(updateGroupActorInfo, (state, action) => {
      const { groupUUID, groupActorUUID, groupActorInfo } = action.payload;

      const groupIndex = state.groups.findIndex((g) => g.uuid === groupUUID);
      if (groupIndex === -1) {
        return;
      }
      const groupActorIndex = state.groups[groupIndex].group_actors!.findIndex(
        (g) => g.uuid === groupActorUUID
      );

      if (groupActorIndex === -1) {
        return;
      }

      _set(
        state.groups[groupIndex],
        ['group_actors', groupActorIndex, 'actor_info'],
        groupActorInfo
      );
      if (!_isNil(groupActorInfo._name)) {
        _set(
          state.groups[groupIndex],
          ['group_actors', groupActorIndex, 'name'],
          groupActorInfo._name
        );
      }
      if (!_isNil(groupActorInfo._desc)) {
        _set(
          state.groups[groupIndex],
          ['group_actors', groupActorIndex, 'desc'],
          groupActorInfo._desc
        );
      }
      if (!_isNil(groupActorInfo._avatar)) {
        _set(
          state.groups[groupIndex],
          ['group_actors', groupActorIndex, 'avatar'],
          groupActorInfo._avatar
        );
      }
    })
    .addCase(UPDATE_GROUP_ACTOR, (state, action: any) => {
      const groupIndex = state.groups.findIndex(
        (g) => g.uuid === action.groupUUID
      );
      if (groupIndex === -1) {
        return;
      }
      const groupActorIndex = state.groups[groupIndex].group_actors!.findIndex(
        (ga) => ga.uuid === action.groupActor.uuid
      );

      if (groupActorIndex === -1) {
        return;
      }

      _set(
        state.groups[groupIndex],
        ['group_actors', groupActorIndex],
        action.groupActor
      );
    })
    .addCase(UPDATE_GROUP_ACTOR_MAPPING, (state, action: any) => {
      state.groupActorMap[action.groupUUID] = action.payload;
    })
    .addCase(UPDATE_GROUP_MAP_LIST, (state, action: any) => {
      const { groupUUID, groupMaps } = action.payload;
      const group = state.groups.find((g) => g.uuid === groupUUID);
      if (!_isNil(group)) {
        group.maps = groupMaps;
      }
    })
    .addCase(ADD_GROUP_MAP, (state, action: any) => {
      const { groupUUID, mapUUID, mapName } = action.payload;
      const group = state.groups.find((g) => g.uuid === groupUUID)!;
      group.maps!.push({
        uuid: mapUUID,
        name: mapName,
      });
    })
    .addCase(QUIT_GROUP_SUCCESS, (state, action: any) => {
      _remove(state.groups, (group) => group.uuid === action.groupUUID);
    })
    .addCase(DISMISS_GROUP_SUCCESS, (state, action: any) => {
      _remove(state.groups, (group) => group.uuid === action.groupUUID);
    })
    .addCase(TICK_MEMBER_SUCCESS, (state, action: any) => {
      const group = state.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      if (!_isNil(group)) {
        _remove(group.group_members!, (member) => member === action.memberUUID);
      }
    })
    .addCase(ADD_GROUP_MEMBER, (state, action: any) => {
      const groupIndex = state.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );

      if (!Array.isArray(state.groups[groupIndex].group_members)) {
        state.groups[groupIndex].group_members = [];
      }

      const groupMemberIndex = state.groups[
        groupIndex
      ].group_members!.findIndex((uuid) => uuid === action.memberUUID);
      if (groupMemberIndex === -1) {
        state.groups[groupIndex].group_members!.push(action.memberUUID);
      }
    })
    .addCase(REMOVE_GROUP_MEMBER, (state, action: any) => {
      const groupIndex = state.groups.findIndex(
        (group) => group.uuid === action.groupUUID
      );
      if (groupIndex >= 0) {
        _remove(
          state.groups[groupIndex].group_members!,
          (member) => member === action.memberUUID
        );
      }
    })
    .addCase(SET_MEMBER_TO_MANAGER_SUCCESS, (state, action: any) => {
      const group = state.groups.find(
        (group) => group.uuid === action.groupUUID
      );
      if (!_isNil(group)) {
        group.managers_uuid!.push(action.memberUUID);
      }
    })
    .addCase(UPDATE_GROUP_STATUS, (state, action: any) => {
      const group = state.groups.find(
        (group) => group.uuid === action.groupUUID
      )!;
      group.status = action.groupStatus;
    });
});
