const {
  ADD_MSG,
  UPDATE_MSG,
} = require('../constants');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();

exports.sendDiceRequest = function(to_uuid, is_group, dice_request, reason) {
  return function(dispatch, getState) {
    return api.emit('dice::sendDiceRequest', {to_uuid, is_group, dice_request, reason} ,function(data) {
      if(data.result) {
        // console.log('pkg', data.pkg);
        dispatch({type: ADD_MSG, converseUUID: to_uuid, payload: data.pkg});
      }else {
        console.error(data);
      }
    })
  }
}

exports.acceptDiceRequest = function(uuid) {
  return function(dispatch, getState) {
    return api.emit('dice::acceptDiceRequest', {msg_card_uuid: uuid} ,function(data) {
      if(data.result) {
        // TODO: 修复同意者接受投骰结果信息的方法
        let log = data.log;
        dispatch({type: UPDATE_MSG, converseUUID: log.sender_uuid, msgUUID: log.uuid, payload: log});
      }else {
        console.error(data);
      }
    })
  }
}

exports.sendDiceInvite = function(to_uuid, is_group, dice_request, reason, inviteUUIDList, inviteNameList) {
  return function(dispatch, getState) {
    return api.emit('dice::sendDiceInvite', {to_uuid, is_group, dice_request, reason, inviteUUIDList, inviteNameList}, function(data) {
      if(data.result) {
        dispatch({type: ADD_MSG, converseUUID: to_uuid, payload: data.pkg});
      }else {
        console.error(data);
      }
    })
  }
}

exports.acceptDiceInvite = function(uuid, isGroupMsg) {
  return function(dispatch, getState) {
    return api.emit('dice::acceptDiceInvite', {msg_card_uuid: uuid} ,function(data) {
      if(data.result) {
        // TODO: 修复同意者接受投骰结果信息的方法
        let log = data.log;
        dispatch({type: UPDATE_MSG, converseUUID: log.to_uuid , msgUUID: log.uuid, payload: log});
      }else {
        console.error(data);
      }
    })
  }
}
