const {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_INFO_CARD,
  HIDE_INFO_CARD,
} = require('../constants');
const immutable = require('immutable');

exports.showLoading = function() {
  return {type: SHOW_LOADING}
}
exports.hideLoading = function() {
  return {type: HIDE_LOADING}
}
exports.showAlert = function(payload) {
  payload = immutable.fromJS(payload);
  return {type: SHOW_ALERT, payload}
}
exports.hideAlert = function() {
  return {type: HIDE_ALERT}
}
exports.showInfoCard = function(info) {
  return (dispatch, getState) => {
    if(!info) {
      // 获取个人信息数据
      info = getState().getIn(['user', 'info']).toJS();
    }
    dispatch({type: SHOW_INFO_CARD, payload: info});
  }

}
exports.hideInfoCard = function() {
  return {type: HIDE_INFO_CARD}
}
