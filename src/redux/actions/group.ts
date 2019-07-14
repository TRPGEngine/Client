import constants from '../constants';
const {
  CREATE_GROUP_SUCCESS,
  GET_GROUP_INFO_SUCCESS,
  UPDATE_GROUP_INFO_SUCCESS,
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
import config from '../../../config/project.config';
import {
  addConverse,
  updateConversesMsglist,
  updateCardChatData,
} from './chat';
import { checkUser, checkTemplate } from '../../shared/utils/cache-helper';
import {
  showLoading,
  hideLoading,
  showAlert,
  hideModal,
  hideAlert,
  hideSlidePanel,
} from './ui';

import * as trpgApi from '../../api/trpg.api';
const api = trpgApi.getInstance();

// 当state->group->groups状态添加新的group时使用来初始化
let initGroupInfo = function(dispatch, group) {
  let groupUUID = group.uuid;
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
  // 获取团成员
  api.emit('group::getGroupMembers', { groupUUID }, function(data) {
    if (data.result) {
      let members = data.members;
      let uuidList = [];
      for (let member of members) {
        let uuid = member.uuid;
        uuidList.push(uuid);
        checkUser(uuid);
      }
      dispatch({
        type: GET_GROUP_MEMBERS_SUCCESS,
        groupUUID,
        payload: uuidList,
      });
    } else {
      console.error('获取团成员失败:', data.msg);
    }
  });
  // 获取团人物
  api.emit('group::getGroupActors', { groupUUID }, function(data) {
    if (data.result) {
      let actors = data.actors;
      for (let ga of actors) {
        ga.avatar = config.file.getAbsolutePath(ga.avatar);
        ga.actor.avatar = config.file.getAbsolutePath(ga.actor.avatar);
        checkTemplate(ga.actor.template_uuid);
      }
      dispatch({ type: GET_GROUP_ACTOR_SUCCESS, groupUUID, payload: actors });
    } else {
      console.error('获取团人物失败:', data.msg);
    }
  });
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
};

export const createGroup = function(name, subname, desc) {
  return function(dispatch, getState) {
    dispatch(showLoading());
    api.emit('group::create', { name, subname, desc }, function(data) {
      dispatch(hideLoading());
      if (data.result) {
        dispatch(hideModal());
        dispatch(showAlert('创建成功'));
        dispatch({ type: CREATE_GROUP_SUCCESS, payload: data.group });
        initGroupInfo(dispatch, data.group); // 创建成功后直接初始化
      } else {
        console.error(data);
        dispatch(showAlert(data.msg));
      }
    });
  };
};

export const getGroupInfo = function(uuid) {
  return function(dispatch, getState) {
    return api.emit('group::getInfo', { uuid }, function(data) {
      if (data.result) {
        let group = data.group;
        group.avatar = config.file.getAbsolutePath(group.avatar);
        dispatch({ type: GET_GROUP_INFO_SUCCESS, payload: group });
        dispatch(getGroupStatus(uuid)); // 获取团信息后再获取团状态作为补充
      } else {
        console.error(data);
      }
    });
  };
};

export const updateGroupInfo = function(groupUUID, groupInfo) {
  return function(dispatch, getState) {
    api.emit('group::updateInfo', { groupUUID, groupInfo }, function(data) {
      if (data.result) {
        let group = data.group;
        group.avatar = config.file.getAbsolutePath(group.avatar);
        dispatch({ type: UPDATE_GROUP_INFO_SUCCESS, payload: group });
        dispatch(hideModal());
        dispatch(showAlert('操作成功'));
      } else {
        console.error(data);
        dispatch(showAlert(data.msg));
      }
    });
  };
};

export const findGroup = function(text, type) {
  return function(dispatch, getState) {
    dispatch({ type: FIND_GROUP_REQUEST });
    console.log('搜索团:', text, type);
    return api.emit('group::findGroup', { text, type }, function(data) {
      console.log('团搜索结果', data);
      if (data.result) {
        for (let group of data.results) {
          group.avatar = config.file.getAbsolutePath(group.avatar);
        }
        dispatch({ type: FIND_GROUP_SUCCESS, payload: data.results });
      } else {
        console.error(data.msg);
      }
    });
  };
};

export const requestJoinGroup = function(group_uuid) {
  return function(dispatch, getState) {
    return api.emit('group::requestJoinGroup', { group_uuid }, function(data) {
      if (data.result) {
        dispatch({ type: REQUEST_JOIN_GROUP_SUCCESS, payload: data.request });
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
      group.avatar = config.file.getAbsolutePath(group.avatar);
      dispatch({ type: ADD_GROUP_SUCCESS, payload: group });
      initGroupInfo(dispatch, group);
    }
  };
};

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

export const sendGroupInvite = function(group_uuid, to_uuid) {
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
export const agreeGroupInvite = function(inviteUUID) {
  return function(dispatch, getState) {
    api.emit('group::agreeGroupInvite', { uuid: inviteUUID }, function(data) {
      if (data.result) {
        let { uuid, group } = data.res;
        group.avatar = config.file.getAbsolutePath(group.avatar);
        dispatch({
          type: AGREE_GROUP_INVITE_SUCCESS,
          payload: { uuid, group },
        });
        if (group) {
          initGroupInfo(dispatch, group);
        }
      } else {
        console.error(data);
      }
    });
  };
};
export const refuseGroupInvite = function(inviteUUID) {
  return function(dispatch, getState) {
    api.emit('group::refuseGroupInvite', { uuid: inviteUUID }, function(data) {
      if (data.result) {
        dispatch({ type: REFUSE_GROUP_INVITE_SUCCESS, payload: data.res });
      } else {
        console.error(data);
      }
    });
  };
};
export const getGroupInvite = function() {
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

export const getGroupList = function() {
  return function(dispatch, getState) {
    return api.emit('group::getGroupList', {}, function(data) {
      if (data.result) {
        let groups = data.groups;
        for (let group of groups) {
          group.avatar = config.file.getAbsolutePath(group.avatar);
        }
        dispatch({ type: GET_GROUP_LIST_SUCCESS, payload: groups });
        for (let group of groups) {
          initGroupInfo(dispatch, group);
          dispatch(getGroupStatus(group.uuid));
        }
      } else {
        console.error(data.msg);
      }
    });
  };
};

export const switchSelectGroup = function(uuid) {
  return { type: SWITCH_GROUP, payload: uuid };
};

export const changeSelectGroupActor = function(groupUUID, groupActorUUID) {
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

export const addGroupActor = function(groupUUID, actorUUID) {
  return function(dispatch, getState) {
    return api.emit('group::addGroupActor', { groupUUID, actorUUID }, function(
      data
    ) {
      if (data.result) {
        let groupActor = data.groupActor;
        groupActor.avatar = config.file.getAbsolutePath(groupActor.avatar);
        dispatch({
          type: ADD_GROUP_ACTOR_SUCCESS,
          groupUUID,
          payload: groupActor,
        });
        dispatch(hideModal());
        dispatch(showAlert('提交成功!'));
      } else {
        dispatch(showAlert(data.msg));
        console.error(data);
      }
    });
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

export const agreeGroupActor = function(groupUUID, groupActorUUID) {
  return function(dispatch, getState) {
    return api.emit(
      'group::agreeGroupActor',
      { groupUUID, groupActorUUID },
      function(data) {
        if (data.result) {
          dispatch({
            type: AGREE_GROUP_ACTOR_SUCCESS,
            groupUUID,
            payload: data.groupActor,
          });
          dispatch(hideModal());
          dispatch(showAlert('已同意该人物加入本团!'));
        } else {
          dispatch(showAlert(data.msg));
          console.error(data);
        }
      }
    );
  };
};

export const refuseGroupActor = function(groupUUID, groupActorUUID) {
  return function(dispatch, getState) {
    return api.emit(
      'group::refuseGroupActor',
      { groupUUID, groupActorUUID },
      function(data) {
        if (data.result) {
          dispatch({
            type: REFUSE_GROUP_ACTOR_SUCCESS,
            groupUUID,
            groupActorUUID,
          });
          dispatch(hideModal());
          dispatch(showAlert('已拒绝该人物加入本团!'));
        } else {
          dispatch(showAlert(data.msg));
          console.error(data);
        }
      }
    );
  };
};

export const updateGroupActorInfo = function(
  groupUUID,
  groupActorUUID,
  groupActorInfo
) {
  return function(dispatch, getState) {
    return api.emit(
      'group::updateGroupActorInfo',
      { groupUUID, groupActorUUID, groupActorInfo },
      function(data) {
        if (data.result) {
          dispatch({
            type: UPDATE_GROUP_ACTOR_INFO_SUCCESS,
            groupUUID,
            groupActorUUID,
            groupActorInfo,
          });
          dispatch(hideModal());
          dispatch(showAlert('保存完毕!'));
        } else {
          dispatch(showAlert(data.msg));
          console.error(data);
        }
      }
    );
  };
};

export const quitGroup = function(groupUUID) {
  return function(dispatch, getState) {
    dispatch(showLoading());
    return api.emit('group::quitGroup', { groupUUID }, function(data) {
      if (data.result) {
        dispatch({ type: QUIT_GROUP_SUCCESS, groupUUID });
        dispatch(showAlert('已退出本群!'));
        dispatch(hideLoading());
      } else {
        console.error(data);
      }
    });
  };
};

export const dismissGroup = function(groupUUID) {
  return function(dispatch, getState) {
    dispatch(showLoading());
    return api.emit('group::dismissGroup', { groupUUID }, function(data) {
      if (data.result) {
        dispatch({ type: DISMISS_GROUP_SUCCESS, groupUUID });
        dispatch(showAlert('已解散本群!'));
        dispatch(hideLoading());
      } else {
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
        console.error(data);
      }
    });
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
