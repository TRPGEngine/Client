const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const { addMsg, updateMsg } = require('./chat');

exports.sendDiceRequest = function(to_uuid, is_group, dice_request, reason) {
  return function(dispatch, getState) {
    return api.emit('dice::sendDiceRequest', {to_uuid, is_group, dice_request, reason} ,function(data) {
      if(data.result) {
        console.log('pkg', data.pkg);
        dispatch(addMsg(to_uuid, data.pkg));
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
        // let log = data.log;
        // let converseUUID = log.is_group ? log.converse_uuid : log.sender_uuid;
        // dispatch(updateMsg(converseUUID, log));
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
        console.log('pkg', data.pkg);
        dispatch(addMsg(to_uuid, data.pkg));
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
        // let log = data.log;
        // let converseUUID = log.is_group ? log.converse_uuid : log.sender_uuid;
        // dispatch(updateMsg(converseUUID, log));
      }else {
        console.error(data);
      }
    })
  }
}
