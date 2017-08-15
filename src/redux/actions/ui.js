const { SHOW_LOADING, HIDE_LOADING } = require('../constants');

exports.showLoading = function() {
  return {type: SHOW_LOADING}
}
exports.hideLoading = function() {
  return {type: HIDE_LOADING}
}
