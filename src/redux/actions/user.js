const { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED } = require('../constants');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const {hideLoading} = require('./ui');

exports.login = function(username, password) {
  return function(dispatch, getState) {
    dispatch({type:LOGIN_REQUEST});
    return api.emit('player::login', {username, password}, function(data) {
      dispatch(hideLoading());
      if(data.result) {
        dispatch({type:LOGIN_SUCCESS,payload: data.info});
      }else {
        dispatch({type:LOGIN_FAILED,payload: data.msg});
      }
    })
  }
}
