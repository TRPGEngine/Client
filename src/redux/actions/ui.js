const {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_MODAL,
  HIDE_MODAL,
  SHOW_PROFILE_CARD,
  HIDE_PROFILE_CARD,
  SWITCH_MENU_PANNEL,
  CHANGE_NETWORK_STATE,
  UPDATE_NOTIFICATION_PERMISSION,
} = require('../constants');
const cache = require('./cache');

exports.showLoading = function(text = '加载中...') {
  return {type: SHOW_LOADING, text: text}
}
exports.hideLoading = function() {
  return {type: HIDE_LOADING}
}
exports.showAlert = function(payload) {
  if(typeof payload === 'string') {
    payload = {
      content: payload
    }
  }
  return {type: SHOW_ALERT, payload}
}
exports.hideAlert = function() {
  return {type: HIDE_ALERT}
}
exports.showModal = function(body) {
  return {type: SHOW_MODAL, payload: body}
}
exports.hideModal = function() {
  return {type: HIDE_MODAL}
}
exports.showProfileCard = function(uuid) {
  return (dispatch, getState) => {
    if(!uuid) {
      // 获取个人信息数据
      uuid = getState().getIn(['user', 'info', 'uuid']);
    }
    // 获取最新信息
    dispatch(cache.getUserInfo(uuid));

    dispatch({type: SHOW_PROFILE_CARD, uuid});
  }

}
exports.hideProfileCard = function() {
  return {type: HIDE_PROFILE_CARD}
}
exports.switchMenuPannel = function(index, pannel = null) {
  return {type: SWITCH_MENU_PANNEL, menuIndex: index, payload: pannel}
}
exports.changeNetworkStatue = function(isOnline, msg, tryReconnect = false) {
  return {type: CHANGE_NETWORK_STATE, payload: {isOnline, msg, tryReconnect}}
}
exports.setNotification = function(target) {
  return function(dispatch, getState) {
    if(target === false) {
      dispatch({type: UPDATE_NOTIFICATION_PERMISSION, payload: 'denied'});
      return;
    }

    Notification.requestPermission(result => {
      console.log('授权结果', result);
      dispatch({type: UPDATE_NOTIFICATION_PERMISSION, payload: result});
    })
  }
}
