const {
  ADD_MSG,
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
        // TODO
        console.log(data);
        // console.log('pkg', data.pkg);
        // dispatch({type: ADD_MSG, converseUUID: to_uuid, payload: data.pkg});
      }else {
        console.error(data);
      }
    })
  }
}
