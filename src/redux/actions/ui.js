const {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_INFO_CARD,
  HIDE_INFO_CARD,
  SHOW_PROFILE_CARD,
  HIDE_PROFILE_CARD,
  SWITCH_MENU,
} = require('../constants');
const cache = require('./cache');

exports.showLoading = function() {
  return {type: SHOW_LOADING}
}
exports.hideLoading = function() {
  return {type: HIDE_LOADING}
}
exports.showAlert = function(payload) {
  return {type: SHOW_ALERT, payload}
}
exports.hideAlert = function() {
  return {type: HIDE_ALERT}
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
