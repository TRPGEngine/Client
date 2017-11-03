const {
  UPDATE_CONVERSES_SUCCESS,
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
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const { addConverse } = require('./chat');
const { checkUser, checkTemplate } = require('../../utils/usercache');
const { showAlert, hideModal } = require('./ui');

// 当state-group-groups状态添加新的group时使用来初始化
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
  api.emit('chat::getChatLog', {room: groupUUID}, function(data) {
    if(data.result) {
      dispatch({type: UPDATE_CONVERSES_SUCCESS, convUUID: groupUUID, payload: data.list})
    }else {
      console.error('获取团聊天记录失败:', data.msg);
    }
  });
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
    return api.emit('group::getGroupList', null, function(data) {
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
    return api.emit('group::addGroupActor', {groupUUID, actorUUID}, function(data, cb) {
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
