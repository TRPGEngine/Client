const {
  CREATE_GROUP_SUCCESS,
  UPDATE_CONVERSES_MSGLIST_SUCCESS,
  GET_GROUP_INFO_SUCCESS,
  UPDATE_GROUP_INFO_SUCCESS,
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
  REMOVE_GROUP_ACTOR_SUCCESS,
  AGREE_GROUP_ACTOR_SUCCESS,
  REFUSE_GROUP_ACTOR_SUCCESS,
  UPDATE_GROUP_ACTOR_INFO_SUCCESS,
  QUIT_GROUP_SUCCESS,
  DISMISS_GROUP_SUCCESS,
  TICK_MEMBER_SUCCESS,
  SET_MEMBER_TO_MANAGER_SUCCESS,
} = require('../constants');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const { addConverse, updateCardChatData } = require('./chat');
const { checkUser, checkTemplate } = require('../../utils/cacheHelper');
const { showLoading, hideLoading, showAlert, hideModal, hideAlert } = require('./ui');

// 当state->group->groups状态添加新的group时使用来初始化
let initGroupInfo = function(dispatch, group) {
  let groupUUID = group.uuid;
  dispatch(addConverse({
    uuid: groupUUID,
    id: group.id,
    name: group.name,
    type: 'group',
    msgList: [],
    lastMsg: '',
    lastTime: '',
  }));
  // 获取团成员
  api.emit('group::getGroupMembers', {groupUUID}, function(data) {
    if(data.result) {
      let members = data.members;
      let uuidList = [];
      for (let member of members) {
        let uuid = member.uuid;
        uuidList.push(uuid);
        checkUser(uuid);
      }
      dispatch({type: GET_GROUP_MEMBERS_SUCCESS, groupUUID, payload: uuidList})
    }else {
      console.error('获取团成员失败:', data.msg);
    }
  });
  // 获取团人物
  api.emit('group::getGroupActors', {groupUUID}, function(data) {
    if(data.result) {
      let actors = data.actors;
      for (let ga of actors) {
        checkTemplate(ga.actor.template_uuid)
      }
      dispatch({type: GET_GROUP_ACTOR_SUCCESS, groupUUID, payload: actors})
    }else {
      console.error('获取团人物失败:', data.msg);
    }
  });
  // 获取团聊天日志
  api.emit('chat::getConverseChatLog', {converse_uuid: groupUUID}, function(data) {
    if(data.result) {
      dispatch({type: UPDATE_CONVERSES_MSGLIST_SUCCESS, convUUID: groupUUID, payload: data.list})
    }else {
      console.error('获取团聊天记录失败:', data.msg);
    }
  });
}

exports.createGroup = function(name, subname, desc) {
  return function(dispatch, getState) {
    dispatch(showLoading());
    api.emit('group::create', {name, subname, desc}, function(data) {
      dispatch(hideLoading());
      if(data.result) {
        dispatch(hideModal());
        dispatch(showAlert('创建成功'));
        dispatch({type: CREATE_GROUP_SUCCESS, payload: data.group});
        initGroupInfo(dispatch, data.group);// 创建成功后直接初始化
      }else {
        console.error(data);
        dispatch(showAlert(data.msg));
      }
    })
  }
}

exports.getGroupInfo = function(uuid) {
  return function(dispatch, getState) {
    api.emit('group::getInfo', {uuid} ,function(data) {
      if(data.result) {
        dispatch({type: GET_GROUP_INFO_SUCCESS, payload: data.group});
      }else {
        console.error(data);
      }
    })
  }
}

exports.updateGroupInfo = function(groupUUID, groupInfo) {
  return function(dispatch, getState) {
    api.emit('group::updateInfo', {groupUUID, groupInfo}, function(data) {
      if(data.result) {
        dispatch({type: UPDATE_GROUP_INFO_SUCCESS, payload: data.group});
        dispatch(hideModal());
        dispatch(showAlert('操作成功'));
      }else {
        console.error(data);
        dispatch(showAlert(data.msg));
      }
    })
  }
}

exports.findGroup = function(text, type) {
  return function(dispatch, getState) {
    dispatch({type: FIND_GROUP_REQUEST});
    console.log('搜索团:', text, type);
    return api.emit('group::findGroup', {text, type}, function(data) {
      console.log('findGroup', data);
      if(data.result) {
        dispatch({type: FIND_GROUP_SUCCESS, payload: data.results});
      }else {
        console.error(data.msg);
      }
    })
  }
}

exports.requestJoinGroup = function(group_uuid) {
  return function(dispatch, getState) {
    return api.emit('group::requestJoinGroup', {group_uuid}, function(data) {
      if(data.result) {
        dispatch({type: REQUEST_JOIN_GROUP_SUCCESS, payload: data.request});
      }else {
        dispatch(showAlert(data.msg));
        console.error(data.msg);
      }
    })
  }
}

exports.agreeGroupRequest = function(chatlogUUID, requestUUID) {
  return function(dispatch, getState) {
    return api.emit('group::agreeGroupRequest', {request_uuid: requestUUID}, function(data) {
      if(data.result) {
        dispatch(updateCardChatData(chatlogUUID, {is_processed: true}));
        dispatch({type: AGREE_GROUP_REQUEST_SUCCESS, groupUUID: data.groupUUID, payload: data.members});
      }else {
        console.error(data.msg);
      }
    })
  }
}
exports.refuseGroupRequest = function(chatlogUUID, requestUUID) {
  return function(dispatch, getState) {
    return api.emit('group::refuseGroupRequest', {request_uuid: requestUUID}, function(data) {
      if(data.result) {
        dispatch(updateCardChatData(chatlogUUID, {is_processed: true}));
      }else {
        console.error(data.msg);
      }
    })
  }
}

exports.sendGroupInvite = function(group_uuid, to_uuid) {
  return function(dispatch, getState) {
    api.emit('group::sendGroupInvite', {group_uuid, to_uuid}, function(data) {
      if(data.result) {
        dispatch({type: SEND_GROUP_INVITE_SUCCESS, payload: data.invite});
      }else {
        console.error(data);
      }
    })
  }
}
exports.agreeGroupInvite = function(inviteUUID) {
  return function(dispatch, getState) {
    api.emit('group::agreeGroupInvite', {uuid: inviteUUID}, function(data) {
      if(data.result) {
        dispatch({type: AGREE_GROUP_INVITE_SUCCESS, payload: data.res});
        if(data.res && data.res.group) {
          initGroupInfo(dispatch, data.res.group);
        }
      }else {
        console.error(data);
      }
    })
  }
}
exports.refuseGroupInvite = function(inviteUUID) {
  return function(dispatch, getState) {
    api.emit('group::refuseGroupInvite', {uuid: inviteUUID}, function(data) {
      if(data.result) {
        dispatch({type: REFUSE_GROUP_INVITE_SUCCESS, payload: data.res});
      }else {
        console.error(data);
      }
    })
  }
}
exports.getGroupInvite = function(inviteUUID) {
  return function(dispatch, getState) {
    api.emit('group::getGroupInvite', {uuid: inviteUUID}, function(data) {
      if(data.result) {
        dispatch({type: GET_GROUP_INVITE_SUCCESS, payload: data.res});
      }else {
        console.error(data);
      }
    })
  }
}

exports.getGroupList = function() {
  return function(dispatch, getState) {
    return api.emit('group::getGroupList', {}, function(data) {
      if(data.result) {
        let groups = data.groups;
        dispatch({type: GET_GROUP_LIST_SUCCESS, payload: groups});
        for (let group of groups) {
          initGroupInfo(dispatch, group);
        }
      }else {
        console.error(data.msg);
      }
    })
  }
}

exports.switchSelectGroup = function(uuid) {
  return {type: SWITCH_GROUP, payload: uuid}
}

exports.changeSelectGroupActor = function(groupUUID, groupActorUUID) {
  return function(dispatch, getState) {
    return api.emit('group::setPlayerSelectedGroupActor', {groupUUID, groupActorUUID}, function(data) {
      if(data.result) {
        dispatch({type: SET_PLAYER_SELECTED_GROUP_ACTOR_SUCCESS, payload: data.data});
      }else {
        console.error(data);
      }
    })
  }
}

exports.addGroupActor = function(groupUUID, actorUUID) {
  return function(dispatch, getState) {
    return api.emit('group::addGroupActor', {groupUUID, actorUUID}, function(data) {
      if(data.result) {
        dispatch({type: ADD_GROUP_ACTOR_SUCCESS, groupUUID, payload: data.groupActor});
        dispatch(hideModal());
        dispatch(showAlert('提交成功!'));
      }else {
        dispatch(showAlert(data.msg));
        console.error(data);
      }
    })
  }
}

exports.removeGroupActor = function(groupUUID, groupActorUUID) {
  return function(dispatch, getState) {
    return api.emit('group::removeGroupActor', {groupUUID, groupActorUUID}, function(data) {
      if(data.result) {
        dispatch({type: REMOVE_GROUP_ACTOR_SUCCESS, groupUUID, groupActorUUID});
        dispatch(hideAlert());
        dispatch(showAlert('提交成功!'));
      }else {
        dispatch(showAlert(data.msg));
        console.error(data);
      }
    })
  }
}

exports.agreeGroupActor = function(groupUUID, groupActorUUID) {
  return function(dispatch, getState) {
    return api.emit('group::agreeGroupActor', {groupUUID, groupActorUUID}, function(data) {
      if(data.result) {
        dispatch({type: AGREE_GROUP_ACTOR_SUCCESS, groupUUID, payload: data.groupActor});
        dispatch(hideModal());
        dispatch(showAlert('已同意该人物加入本团!'));
      }else {
        dispatch(showAlert(data.msg));
        console.error(data);
      }
    })
  }
}

exports.refuseGroupActor = function(groupUUID, groupActorUUID) {
  return function(dispatch, getState) {
    return api.emit('group::refuseGroupActor', {groupUUID, groupActorUUID}, function(data) {
      if(data.result) {
        dispatch({type: REFUSE_GROUP_ACTOR_SUCCESS, groupUUID, groupActorUUID});
        dispatch(hideModal());
        dispatch(showAlert('已拒绝该人物加入本团!'));
      }else {
        dispatch(showAlert(data.msg));
        console.error(data);
      }
    })
  }
}

exports.updateGroupActorInfo = function(groupUUID, groupActorUUID, groupActorInfo) {
  return function(dispatch, getState) {
    return api.emit('group::updateGroupActorInfo', {groupUUID, groupActorUUID, groupActorInfo}, function(data) {
      if(data.result) {
        dispatch({type: UPDATE_GROUP_ACTOR_INFO_SUCCESS, groupUUID, groupActorUUID, groupActorInfo});
        dispatch(hideModal());
        dispatch(showAlert('保存完毕!'));
      }else {
        dispatch(showAlert(data.msg));
        console.error(data);
      }
    })
  }
}

exports.quitGroup = function(groupUUID) {
  return function(dispatch, getState) {
    return api.emit('group::quitGroup', {groupUUID}, function(data) {
      if(data.result) {
        dispatch({type: QUIT_GROUP_SUCCESS, groupUUID});
        dispatch(showAlert('已退出本群!'));
      }else {
        console.error(data);
      }
    })
  }
}

exports.dismissGroup = function(groupUUID) {
  return function(dispatch, getState) {
    return api.emit('group::dismissGroup', {groupUUID}, function(data) {
      if(data.result) {
        dispatch({type: DISMISS_GROUP_SUCCESS, groupUUID});
        dispatch(showAlert('已解散本群!'));
      }else {
        console.error(data);
      }
    })
  }
}

exports.tickMember = function(groupUUID, memberUUID) {
  return function(dispatch, getState) {
    return api.emit('group::tickMember', {groupUUID, memberUUID}, function(data) {
      if(data.result) {
        dispatch({type: TICK_MEMBER_SUCCESS, groupUUID, memberUUID});
        dispatch(showAlert('操作成功'));
        dispatch(hideModal());
      }else {
        console.error(data);
      }
    })
  }
}

exports.setMemberToManager = function(groupUUID, memberUUID) {
  return function(dispatch, getState) {
    return api.emit('group::setMemberToManager', {groupUUID, memberUUID}, function(data) {
      if(data.result) {
        dispatch({type: SET_MEMBER_TO_MANAGER_SUCCESS, groupUUID, memberUUID});
        dispatch(showAlert('操作成功'));
        dispatch(hideModal());
      }else {
        console.error(data);
        dispatch(showAlert(data.msg));
      }
    })
  }
}
