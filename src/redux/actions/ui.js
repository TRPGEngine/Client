const {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_MODAL,
  HIDE_MODAL,
  SHOW_TOAST,
  HIDE_TOAST,
  SHOW_PROFILE_CARD,
  HIDE_PROFILE_CARD,
  SHOW_SLIDE_PANEL,
  HIDE_SLIDE_PANEL,
  SWITCH_MENU_PANNEL,
  SET_LAST_DICE_TYPE,
  CHANGE_NETWORK_STATE,
  UPDATE_SOCKET_ID,
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

let toastTimer;
exports.showToast = function(msg) {
  return (dispatch, getState) => {
    dispatch({type: SHOW_TOAST, text: msg});

    if(toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      dispatch({type: HIDE_TOAST});
      toastTimer = null;
    }, 2000);
  }
}
exports.hideToast = function() {
  return {type: HIDE_TOAST}
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
exports.showSlidePanel = function(title, content) {
  return {type: SHOW_SLIDE_PANEL, payload: {title, content}}
}
exports.hideSlidePanel = function() {
  return {type: HIDE_SLIDE_PANEL}
}
exports.switchMenuPannel = function(index, pannel = null) {
  return {type: SWITCH_MENU_PANNEL, menuIndex: index, payload: pannel}
}
exports.setLastDiceType = function(type = 'basicDice') {
  return {type: SET_LAST_DICE_TYPE, payload: type}
}
exports.changeNetworkStatue = function(isOnline, msg, tryReconnect = false) {
  return {type: CHANGE_NETWORK_STATE, payload: {isOnline, msg, tryReconnect}}
}

exports.updateSocketId = function(socketId) {
  return {type: UPDATE_SOCKET_ID, socketId}
}
