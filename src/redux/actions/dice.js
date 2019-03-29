const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const { addMsg } = require('./chat');
const { showAlert } = require('./ui');

exports.sendDiceRequest = function(to_uuid, is_group, dice_request, reason) {
  return function(dispatch, getState) {
    return api.emit(
      'dice::sendDiceRequest',
      { to_uuid, is_group, dice_request, reason },
      function(data) {
        if (data.result) {
          console.log('pkg', data.pkg);
          dispatch(addMsg(to_uuid, data.pkg));
        } else {
          console.error(data);
        }
      }
    );
  };
};

exports.acceptDiceRequest = function(uuid) {
  return function(dispatch, getState) {
    return api.emit(
      'dice::acceptDiceRequest',
      { msg_card_uuid: uuid },
      function(data) {
        if (data.result) {
          // let log = data.log;
          // let converseUUID = log.is_group ? log.converse_uuid : log.sender_uuid;
          // dispatch(updateMsg(converseUUID, log));
        } else {
          console.error(data);
        }
      }
    );
  };
};

exports.sendDiceInvite = function(
  to_uuid,
  is_group,
  dice_request,
  reason,
  inviteUUIDList,
  inviteNameList
) {
  return function(dispatch, getState) {
    return api.emit(
      'dice::sendDiceInvite',
      {
        to_uuid,
        is_group,
        dice_request,
        reason,
        inviteUUIDList,
        inviteNameList,
      },
      function(data) {
        if (data.result) {
          console.log('pkg', data.pkg);
          dispatch(addMsg(to_uuid, data.pkg));
        } else {
          console.error(data);
        }
      }
    );
  };
};

exports.acceptDiceInvite = function(uuid, isGroupMsg) {
  return function(dispatch, getState) {
    return api.emit('dice::acceptDiceInvite', { msg_card_uuid: uuid }, function(
      data
    ) {
      if (data.result) {
        // let log = data.log;
        // let converseUUID = log.is_group ? log.converse_uuid : log.sender_uuid;
        // dispatch(updateMsg(converseUUID, log));
      } else {
        console.error(data);
      }
    });
  };
};

exports.sendQuickDice = function(to_uuid, is_group, dice_request) {
  return function(dispatch, getState) {
    return api.emit(
      'dice::sendQuickDice',
      { to_uuid, is_group, dice_request },
      function(data) {
        if (data.result) {
          // console.log('pkg', data);
        } else {
          console.error(data);
          dispatch(showAlert('快速投骰失败'));
        }
      }
    );
  };
};
