import constants from '../constants';
const {
  CREATE_GROUP_SUCCESS,
  GET_GROUP_INFO_SUCCESS,
  UPDATE_GROUP_INFO,
  FIND_GROUP_REQUEST,
  FIND_GROUP_SUCCESS,
  REQUEST_JOIN_GROUP_SUCCESS,
  ADD_GROUP_SUCCESS,
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
  UPDATE_PLAYER_SELECTED_GROUP_ACTOR,
  REMOVE_CONVERSES_SUCCESS,
  ENSURE_GROUP_CHANNEL_CONVERSE,
} = constants;
import config from '../../project.config';
import {
  addConverse,
  updateConversesMsglist,
  updateCardChatData,
  markConverseMsgListQueryed,
} from './chat';
import { checkUser, checkTemplate } from '../../utils/cache-helper';
import {
  showLoading,
  hideLoading,
  showAlert,
  hideModal,
  hideAlert,
  hideSlidePanel,
  showToast,
} from './ui';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';

import * as trpgApi from '../../api/trpg.api';
import { TRPGAction, createTRPGAsyncThunk } from '../types/__all__';
import { getGroupInviteInfo } from './cache';
import { GroupInfo, GroupActorType } from '@redux/types/group';
import { showToasts } from '@shared/manager/ui';
import { createAction } from '@reduxjs/toolkit';
const api = trpgApi.getInstance();

// 当state->group->groups状态添加新的group时使用来初始化
const initGroupInfo = function(group: GroupInfo): TRPGAction {
  return function(dispatch, getState) {
    const groupUUID = group.uuid;
    dispatch(
      addConverse({
        uuid: groupUUID,
        id: group.id,
        name: group.name,
        type: 'group',
        msgList: [],
        lastMsg: '',
        lastTime: 0, // 设定初始化的团时间为0方便排序
      })
    );

    // 获取团初始数据
    api.emit('group::getGroupInitData', { groupUUID }, function(data) {
      if (data.result) {
        const { members, groupActors, groupActorsMapping, groupPanels } = data;

        // 处理团成员
        const uuidList: string[] = [];
        for (const member of members) {
          const uuid = member.uuid;
          uuidList.push(uuid);
          checkUser(uuid);
        }
        dispatch({
          type: GET_GROUP_MEMBERS_SUCCESS,
          groupUUID,
          payload: uuidList,
        });

        // 处理团人物
        for (const ga of groupActors) {
          // 处理头像
          _set(ga, 'avatar', config.file.getAbsolutePath!(_get(ga, 'avatar')));
          _set(
            ga,
            'actor.avatar',
            config.file.getAbsolutePath!(_get(ga, 'actor.avatar'))
          );
          if (ga.actor.template_uuid) {
            // 如果有则检查
            checkTemplate(ga.actor.template_uuid);
          }
        }
        dispatch({
          type: GET_GROUP_ACTOR_SUCCESS,
          groupUUID,
          payload: groupActors,
        });

        // 处理团选择人物mapping
        dispatch({
          type: UPDATE_GROUP_ACTOR_MAPPING,
          groupUUID,
          payload: groupActorsMapping,
        });
      } else {
        console.error('获取团初始数据失败:', data.msg);
      }
    });

    // 获取自己选择的团角色
    dispatch(getSelectedGroupActor(groupUUID));

    // 获取团聊天日志
    api.emit('chat::getConverseChatLog', { converse_uuid: groupUUID }, function(
      data
    ) {
      if (data.result) {
        dispatch(updateConversesMsglist(groupUUID, data.list));
      } else {
        console.error('获取团聊天记录失败:', data.msg);
      }
    });

    api.emit('trpg::getGroupMapList', { groupUUID }, function(data) {
      if (!data.result) {
        console.error('获取地图列表失败:', data.msg);
        return;
      }

      dispatch(updateGroupMapList(groupUUID, data.maps ?? []));
    });
  };
};

/**
 * 创建团
 * @param name 团名
 * @param subname 团副名
 * @param desc 团描述
 */
export const createGroup = function(
  name: string,
  subname: string,
  desc: string
): TRPGAction {
  return function(dispatch, getState) {
    dispatch(showLoading());
    api.emit('group::create', { name, subname, desc }, function(data) {
      dispatch(hideLoading());
      if (data.result) {
        dispatch(hideModal());
        dispatch(showAlert('创建成功'));
        dispatch(createGroupSuccess(data.group));
      } else {
        console.error(data);
        dispatch(showAlert(data.msg));
      }
    });
  };
};

/**
 * 创建团成功
 */
export const createGroupSuccess = function(group: GroupInfo): TRPGAction {
  return function(dispatch, getState) {
    dispatch({ type: CREATE_GROUP_SUCCESS, payload: group });
    dispatch(initGroupInfo(group)); // 创建成功后直接初始化
  };
};

/**
 * 获取团信息
 * 注意: 不会进行group初始化操作
 * @param uuid 团UUID
 */
export const getGroupInfo = function(uuid: string): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('group::getInfo', { uuid }, function(data) {
      if (data.result) {
        const group = data.group;
        group.avatar = config.file.getAbsolutePath!(group.avatar);
        dispatch({ type: GET_GROUP_INFO_SUCCESS, payload: group });
        dispatch(getGroupStatus(uuid)); // 获取团信息后再获取团状态作为补充
      } else {
        console.error(data);
      }
    });
  };
};

/**
 * 更新团信息
 * @param groupUUID 团UUID
 * @param groupInfo 团信息
 */
export const requestUpdateGroupInfo = function(
  groupUUID: string,
  groupInfo: object
) {
  return function(dispatch, getState) {
    api.emit('group::updateInfo', { groupUUID, groupInfo }, function(data) {
      if (data.result) {
        const group = data.group;
        group.avatar = config.file.getAbsolutePath!(group.avatar);
        dispatch(updateGroupInfo(group));
        dispatch(hideModal());
        dispatch(showAlert('操作成功'));
      } else {
        console.error(data);
        dispatch(showAlert(data.msg));
      }
    });
  };
};
export function updateGroupInfo(groupInfo: object): TRPGAction {
  return { type: UPDATE_GROUP_INFO, payload: groupInfo };
}

export function findGroup(text: string, type: string): TRPGAction {
  return function(dispatch, getState) {
    dispatch({ type: FIND_GROUP_REQUEST });
    console.log('搜索团:', text, type);
    return api.emit('group::findGroup', { text, type }, function(data) {
      console.log('团搜索结果', data);
      if (data.result) {
        for (const group of data.results) {
          group.avatar = config.file.getAbsolutePath!(group.avatar);
        }
        dispatch({ type: FIND_GROUP_SUCCESS, payload: data.results });
      } else {
        console.error(data.msg);
      }
    });
  };
}

/**
 * 发送申请加入团
 * @param group_uuid 团UUID
 */
export const requestJoinGroup = function(group_uuid: string) {
  return function(dispatch, getState) {
    return api.emit('group::requestJoinGroup', { group_uuid }, function(data) {
      if (data.result) {
        dispatch({ type: REQUEST_JOIN_GROUP_SUCCESS, payload: data.request });
        dispatch(showAlert('已发送入团申请'));
      } else {
        dispatch(showAlert(data.msg));
        console.error(data.msg);
      }
    });
  };
};

// 加入团
export const addGroup = function(group) {
  return function(dispatch, getState) {
    if (group) {
      group.avatar = config.file.getAbsolutePath!(group.avatar);
      dispatch({ type: ADD_GROUP_SUCCESS, payload: group });
      dispatch(initGroupInfo(group));
    }
  };
};

// 移除团
export const removeGroup = function(groupUUID: string): TRPGAction {
  return function(dispatch, getState) {
    dispatch({
      type: QUIT_GROUP_SUCCESS,
      groupUUID,
    });

    // 移除聊天会话
    dispatch({
      type: REMOVE_CONVERSES_SUCCESS,
      converseUUID: groupUUID,
    });
  };
};

/**
 * 同意入团邀请
 */
export const agreeGroupRequest = function(chatlogUUID, requestUUID, fromUUID) {
  checkUser(fromUUID);

  return function(dispatch, getState) {
    return api.emit(
      'group::agreeGroupRequest',
      { request_uuid: requestUUID },
      function(data) {
        if (data.result) {
          dispatch(updateCardChatData(chatlogUUID, { is_processed: true }));
          dispatch({
            type: AGREE_GROUP_REQUEST_SUCCESS,
            groupUUID: data.groupUUID,
            payload: data.members,
          });
        } else {
          console.error(data.msg);
        }
      }
    );
  };
};
export const refuseGroupRequest = function(chatlogUUID, requestUUID) {
  return function(dispatch, getState) {
    return api.emit(
      'group::refuseGroupRequest',
      { request_uuid: requestUUID },
      function(data) {
        if (data.result) {
          dispatch(updateCardChatData(chatlogUUID, { is_processed: true }));
        } else {
          console.error(data.msg);
        }
      }
    );
  };
};

export const sendGroupInvite = function(
  group_uuid: string,
  to_uuid: string
): TRPGAction {
  return function(dispatch, getState) {
    api.emit('group::sendGroupInvite', { group_uuid, to_uuid }, function(data) {
      if (data.result) {
        dispatch(showAlert('发送邀请成功!'));
        dispatch(hideSlidePanel());
        dispatch({ type: SEND_GROUP_INVITE_SUCCESS, payload: data.invite });
      } else {
        dispatch(showAlert(data.msg));
        console.error(data);
      }
    });
  };
};
/**
 * 批量邀请用户加入团
 * @param group_uuid 团UUID
 * @param target_uuids 目标用户UUID列表
 */
export const sendGroupInviteBatch = (
  group_uuid: string,
  target_uuids: string[]
): TRPGAction => {
  return function(dispatch, getState) {
    api.emit(
      'group::sendGroupInviteBatch',
      { group_uuid, target_uuids },
      function(data) {
        if (data.result) {
          dispatch(showAlert('发送邀请成功!'));
          dispatch(hideSlidePanel());
        } else {
          dispatch(showAlert(data.msg));
          console.error(data);
        }
      }
    );
  };
};

export const agreeGroupInvite = function(inviteUUID: string): TRPGAction {
  return function(dispatch, getState) {
    api.emit('group::agreeGroupInvite', { uuid: inviteUUID }, function(data) {
      if (data.result) {
        const { uuid, group } = data.res;
        group.avatar = config.file.getAbsolutePath!(group.avatar);
        dispatch({
          type: AGREE_GROUP_INVITE_SUCCESS,
          payload: { uuid, group },
        });
        dispatch(getGroupInviteInfo(inviteUUID)); // 操作成功后重新获取邀请信息缓存
        if (group) {
          dispatch(initGroupInfo(group));
        }
      } else {
        console.error(data);
        showToasts(data.msg, 'error');
      }
    });
  };
};
export const refuseGroupInvite = function(inviteUUID: string): TRPGAction {
  return function(dispatch, getState) {
    api.emit('group::refuseGroupInvite', { uuid: inviteUUID }, function(data) {
      if (data.result) {
        dispatch({ type: REFUSE_GROUP_INVITE_SUCCESS, payload: data.res });
        dispatch(getGroupInviteInfo(inviteUUID)); // 操作成功后重新获取邀请信息缓存
      } else {
        console.error(data);
      }
    });
  };
};
export const getGroupInvite = function(): TRPGAction {
  return function(dispatch, getState) {
    api.emit('group::getGroupInvite', function(data) {
      if (data.result) {
        dispatch({ type: GET_GROUP_INVITE_SUCCESS, payload: data.res });
      } else {
        console.error(data);
      }
    });
  };
};

export const getGroupList = function(): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('group::getGroupList', {}, function(data) {
      if (data.result) {
        const groups: GroupInfo[] = data.groups;
        for (const group of groups) {
          group.avatar = config.file.getAbsolutePath!(group.avatar);

          // 初始化部分数据
          group.maps_uuid = group.maps_uuid ?? [];
          group.group_actors = group.group_actors ?? [];
          group.group_members = group.group_members ?? [];
        }

        dispatch({ type: GET_GROUP_LIST_SUCCESS, payload: groups });
        for (const group of groups) {
          dispatch(initGroupInfo(group));
          dispatch(getGroupStatus(group.uuid)); // 获取团状态
        }
      } else {
        console.error(data.msg);
      }
    });
  };
};

export const switchSelectGroup = function(uuid: string): TRPGAction {
  return { type: SWITCH_GROUP, payload: uuid };
};

export const clearSelectGroup = function(): TRPGAction {
  return { type: SWITCH_GROUP, payload: '' };
};

/**
 * 获取当前团选择的团角色
 * @param groupUUID 团UUID
 */
export const getSelectedGroupActor = function(groupUUID: string): TRPGAction {
  return function(dispatch, getState) {
    const userUUID = getState().user.info.uuid;
    return api.emit(
      'group::getPlayerSelectedGroupActor',
      {
        groupUUID,
        groupMemberUUID: userUUID,
      },
      function(data) {
        if (data.result) {
          const groupActorUUID = _get(
            data,
            'playerSelectedGroupActor.selectedGroupActorUUID'
          );

          dispatch({
            type: SET_PLAYER_SELECTED_GROUP_ACTOR_SUCCESS,
            payload: {
              groupUUID,
              groupActorUUID,
            },
          });
        } else {
          console.error(data);
        }
      }
    );
  };
};

/**
 * 修改当前选中的团角色的UUID
 * @param groupUUID 团UUID
 * @param groupActorUUID 团角色UUID
 */
export const changeSelectGroupActor = function(
  groupUUID: string,
  groupActorUUID: string
): TRPGAction {
  return function(dispatch, getState) {
    return api.emit(
      'group::setPlayerSelectedGroupActor',
      { groupUUID, groupActorUUID },
      function(data) {
        if (data.result) {
          dispatch({
            type: SET_PLAYER_SELECTED_GROUP_ACTOR_SUCCESS,
            payload: data.data,
          });
        } else {
          console.error(data);
        }
      }
    );
  };
};

/**
 * 更新用户选择的团角色
 */
export const updatePlayerSelectedGroupActor = function(
  groupUUID: string,
  userUUID: string,
  groupActorUUID: string
) {
  return {
    type: UPDATE_PLAYER_SELECTED_GROUP_ACTOR,
    payload: { groupUUID, userUUID, groupActorUUID },
  };
};

/**
 * 增加一个待审核的人物卡
 * @param groupUUID 团UUID
 * @param actorUUID 角色UUID
 */
export const requestAddGroupActor = function(
  groupUUID: string,
  actorUUID: string
): TRPGAction {
  return function(dispatch, getState) {
    return api.emit('group::addGroupActor', { groupUUID, actorUUID }, function(
      data
    ) {
      if (data.result) {
        dispatch(hideModal());
        dispatch(showAlert('提交成功!'));
      } else {
        dispatch(showAlert(data.msg));
        console.error(data);
      }
    });
  };
};

/**
 * 增加团人物卡
 */
export const addGroupActor = function(
  groupUUID: string,
  groupActor: GroupActorType
) {
  return {
    type: ADD_GROUP_ACTOR,
    groupUUID,
    payload: groupActor,
  };
};

export const removeGroupActor = function(groupUUID, groupActorUUID) {
  return function(dispatch, getState) {
    return api.emit(
      'group::removeGroupActor',
      { groupUUID, groupActorUUID },
      function(data) {
        if (data.result) {
          dispatch({
            type: REMOVE_GROUP_ACTOR_SUCCESS,
            groupUUID,
            groupActorUUID,
          });
          dispatch(hideAlert());
          dispatch(showAlert('提交成功!'));
        } else {
          dispatch(showAlert(data.msg));
          console.error(data);
        }
      }
    );
  };
};

/**
 * 同意团角色
 */
export const agreeGroupActor = createAction<{
  groupUUID: string;
  groupActor: any;
}>(AGREE_GROUP_ACTOR_SUCCESS);

/**
 * 拒绝团角色
 */
export const refuseGroupActor = createAction<{
  groupUUID: string;
  groupActorUUID: string;
}>(REFUSE_GROUP_ACTOR_SUCCESS);

/**
 * 更新团人物卡数据
 */
export const updateGroupActorInfo = createAction(
  UPDATE_GROUP_ACTOR_INFO,
  (
    groupUUID: string,
    groupActorUUID: string,
    groupActorInfo: { [key: string]: any }
  ) => ({
    payload: { groupUUID, groupActorUUID, groupActorInfo },
  })
);

/**
 * 更新团人物卡信息
 */
export const updateGroupActor = function(
  groupUUID: string,
  groupActor: GroupActorType
): TRPGAction {
  return {
    type: UPDATE_GROUP_ACTOR,
    groupUUID,
    groupActor,
  };
};

/**
 * 更新团地图列表
 * @param groupUUID 团UUID
 * @param groupMaps 地图列表
 */
export const updateGroupMapList = function(
  groupUUID: string,
  groupMaps: Pick<GroupInfo, 'maps'>
) {
  return {
    type: UPDATE_GROUP_MAP_LIST,
    payload: { groupUUID, groupMaps },
  };
};

/**
 * 添加单张团地图
 * @param groupUUID 团UUID
 * @param mapUUID 地图UUID
 * @param mapName 地图名
 */
export const addGroupMap = function(
  groupUUID: string,
  mapUUID: string,
  mapName: string
): TRPGAction {
  return {
    type: ADD_GROUP_MAP,
    payload: { groupUUID, mapUUID, mapName },
  };
};

/**
 * 创建团地图
 * @param groupUUID 团UUID
 * @param name 地图名
 * @param width 地图宽度
 * @param height 地图高度
 */
export const createGroupMap = function(
  groupUUID: string,
  name: string,
  width: number,
  height: number
): TRPGAction {
  return function(dispatch, getState) {
    return api.emit(
      'trpg::createGroupMap',
      { groupUUID, name, width, height },
      function(data) {
        if (data.result) {
          dispatch(hideModal());
        } else {
          dispatch(showAlert(data.msg));
        }
      }
    );
  };
};

export const quitGroup = function(groupUUID: string): TRPGAction {
  return function(dispatch, getState) {
    dispatch(showLoading());
    return api.emit('group::quitGroup', { groupUUID }, function(data) {
      if (data.result) {
        dispatch(removeGroup(groupUUID));
        dispatch(showAlert('已退出本群!'));
        dispatch(hideLoading());
      } else {
        dispatch(showToast(data?.msg));
        console.error(data);
      }
    });
  };
};

export const dismissGroup = function(groupUUID: string): TRPGAction {
  return function(dispatch, getState) {
    dispatch(showLoading());
    return api.emit('group::dismissGroup', { groupUUID }, function(data) {
      if (data.result) {
        dispatch({ type: DISMISS_GROUP_SUCCESS, groupUUID });
        dispatch({ type: REMOVE_CONVERSES_SUCCESS, converseUUID: groupUUID }); // 移除聊天会话
        dispatch(showAlert('已解散本群!'));
        dispatch(hideLoading());
      } else {
        dispatch(showToast(data?.msg));
        console.error(data);
      }
    });
  };
};

export const tickMember = function(groupUUID, memberUUID) {
  return function(dispatch, getState) {
    return api.emit('group::tickMember', { groupUUID, memberUUID }, function(
      data
    ) {
      if (data.result) {
        dispatch({ type: TICK_MEMBER_SUCCESS, groupUUID, memberUUID });
        dispatch(showAlert('操作成功'));
        dispatch(hideModal());
      } else {
        dispatch(showToast(data?.msg));
        console.error(data);
      }
    });
  };
};

/**
 * 增加团成员列表UUID
 * @param groupUUID 团UUID
 * @param memberUUID 成员UUID
 */
export const addGroupMember = function(groupUUID: string, memberUUID: string) {
  return {
    type: ADD_GROUP_MEMBER,
    groupUUID,
    memberUUID,
  };
};

/**
 * 移除团成员列表UUID
 * @param groupUUID 团UUID
 * @param memberUUID 成员UUID
 */
export const removeGroupMember = function(
  groupUUID: string,
  memberUUID: string
): TRPGAction {
  return function(dispatch, getState) {
    const userUUID = getState().user.info.uuid;
    if (memberUUID === userUUID) {
      // 如果被踢出的是自己
      dispatch(removeGroup(groupUUID));
    } else {
      // 如果被踢出的是团里其他人
      dispatch({
        type: REMOVE_GROUP_MEMBER,
        groupUUID,
        memberUUID,
      });
    }
  };
};

export const setMemberToManager = function(groupUUID, memberUUID) {
  return function(dispatch, getState) {
    return api.emit(
      'group::setMemberToManager',
      { groupUUID, memberUUID },
      function(data) {
        if (data.result) {
          dispatch({
            type: SET_MEMBER_TO_MANAGER_SUCCESS,
            groupUUID,
            memberUUID,
          });
          dispatch(showAlert('操作成功'));
          dispatch(hideModal());
        } else {
          console.error(data);
          dispatch(showAlert(data.msg));
        }
      }
    );
  };
};

export const updateGroupStatus = function(groupUUID, groupStatus) {
  return { type: UPDATE_GROUP_STATUS, groupUUID, groupStatus };
};

export const getGroupStatus = function(groupUUID) {
  return function(dispatch, getState) {
    return api.emit('group::getGroupStatus', { groupUUID }, function(data) {
      if (data.result) {
        dispatch(updateGroupStatus(groupUUID, data.status));
      } else {
        console.error(data);
      }
    });
  };
};

export const setGroupStatus = function(groupUUID, groupStatus) {
  return function(dispatch, getState) {
    return api.emit(
      'group::setGroupStatus',
      { groupUUID, groupStatus },
      function(data) {
        if (data.result) {
          dispatch(updateGroupStatus(groupUUID, groupStatus));
        } else {
          console.error(data);
        }
      }
    );
  };
};

/**
 * 创建团频道
 * @param groupUUID 所属团UUID
 * @param name 频道名
 * @param desc 频道描述
 */
export const createGroupChannel = function(
  groupUUID: string,
  name: string,
  desc: string
): TRPGAction {
  return function(dispatch, getState) {
    return api.emit(
      'group::createGroupChannel',
      { groupUUID, name, desc },
      function(data) {
        if (data.result) {
          dispatch(hideModal());
        } else {
          dispatch(showAlert(data.msg));
        }
      }
    );
  };
};

/**
 * 确保团频道聊天频道会话存在
 */
export const ensureGroupChannelConverse = createTRPGAsyncThunk<{
  groupUUID: string;
  channelUUID: string;
  channelName: string;
}>(
  ENSURE_GROUP_CHANNEL_CONVERSE,
  async ({ groupUUID, channelUUID, channelName }, thunkAPI) => {
    const isQueryed = thunkAPI
      .getState()
      .chat.queryedConverseList.includes(channelUUID);

    if (isQueryed) {
      // 如果请求过则直接跳过
      return;
    }

    thunkAPI.dispatch(markConverseMsgListQueryed(channelUUID));
    // 没有会话，要添加会话
    thunkAPI.dispatch(
      addConverse({
        uuid: channelUUID,
        type: 'channel',
        name: channelName,
        _groupUUID: groupUUID,
      })
    );

    // 获取频道聊天日志
    const data = await api.emitP('chat::getConverseChatLog', {
      converse_uuid: channelUUID,
    });

    if (data.result) {
      thunkAPI.dispatch(updateConversesMsglist(channelUUID, data.list));
    } else {
      console.error('获取团聊天记录失败:', data.msg);
    }
  }
);
