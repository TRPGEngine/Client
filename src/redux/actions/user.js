const { LOGIN } = require('../constants');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();

exports.login = function(username, password) {
  return function(dispatch, getState) {
    dispatch({type:'REQUEST_LOGIN'});
    return api.emit('player::login', {username, password}, function(data) {
      dispatch(require('./ui').hideLoading());
      dispatch({type:'RECEIVED_LOGIN',payload: data});
    })
  }
}
