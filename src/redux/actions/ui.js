const {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
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
