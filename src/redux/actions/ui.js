const {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_MODAL,
  HIDE_MODAL,
  SHOW_INFO_CARD,
  HIDE_INFO_CARD,
  SHOW_PROFILE_CARD,
  HIDE_PROFILE_CARD,
  SWITCH_MENU,
  CHANGE_NETWORK_STATE,
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
exports.showInfoCard = function(uuid) {
  return (dispatch, getState) => {
    if(!uuid) {
      // 获取个人信息数据
      uuid = getState().getIn(['user', 'info', 'uuid']);
    }else {
      // 发起一次更新用户信息的请求
      dispatch(cache.getUserInfo(uuid));
    }
    dispatch({type: SHOW_INFO_CARD, uuid});
  }

}
exports.hideInfoCard = function() {
  return {type: HIDE_INFO_CARD}
}
exports.showProfileCard = function() {
  return (dispatch, getState) => {
    // 获取最新信息
    let uuid = getState().getIn(['user', 'info', 'uuid']);
    dispatch(cache.getUserInfo(uuid));

    dispatch({type: SHOW_PROFILE_CARD});
  }

}
exports.hideProfileCard = function() {
  return {type: HIDE_PROFILE_CARD}
}
exports.switchMenu = function(menuIndex = 0) {
  return {type: SWITCH_MENU, menuIndex: menuIndex}
}
exports.changeNetworkStatue = function(isOnline, msg, tryReconnect = false) {
  return {type: CHANGE_NETWORK_STATE, payload: {isOnline, msg, tryReconnect}}
}
