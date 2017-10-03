const {
  GET_GROUP_INFO_SUCCESS,
  SEND_GROUP_INVITE_SUCCESS,
  AGREE_GROUP_INVITE_SUCCESS,
  REFUSE_GROUP_INVITE_SUCCESS,
  GET_GROUP_INVITE_SUCCESS,
  GET_GROUP_LIST_SUCCESS,
  SWITCH_GROUP,
} = require('../constants');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();

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
        dispatch({type: GET_GROUP_LIST_SUCCESS, payload: data.groups});
      }else {
        console.error(data.msg);
      }
    })
  }
}

exports.switchSelectGroup = function(uuid) {
  return {type: SWITCH_GROUP, payload: uuid}
}
