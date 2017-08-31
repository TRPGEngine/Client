const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  FIND_USER_REQUEST,
  FIND_USER_SUCCESS,
  FIND_USER_FAILED,
} = require('../constants');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const { hideLoading, showAlert } = require('./ui');

exports.login = function(username, password) {
  return function(dispatch, getState) {
    dispatch({type:LOGIN_REQUEST});
    return api.emit('player::login', {username, password}, function(data) {
      dispatch(hideLoading());
      if(data.result) {
        dispatch({type:LOGIN_SUCCESS, payload: data.info});
      }else {
        dispatch(showAlert({
          type: 'alert',
          title: '登录失败',
          content: data.msg
        }));
        dispatch({type:LOGIN_FAILED, payload: data.msg});
      }
    })
  }
}

exports.logout = function() {
  return function(dispatch, getState) {
    let info = getState().getIn(['user','info']);
    let uuid = info.get('uuid');
    let token = info.get('token');
    dispatch({type: LOGOUT});
    api.emit('player::logout', {uuid, token} ,function(data) {
      console.log(data);
    })
  }
}

exports.register = function(username, password) {
  return function(dispatch, getState) {
    dispatch({type:REGISTER_REQUEST});
    return api.emit('player::register', {username, password}, function(data) {
      dispatch(hideLoading());
      console.log(data);
      if(data.result) {
        dispatch({type:REGISTER_SUCCESS, payload: data.results});
      }else {
        dispatch({type:REGISTER_FAILED, payload: data.msg});
        dispatch(showAlert({
          type: 'alert',
          title: '注册失败',
          content: data.msg
        }));
      }
    })
  }
}

exports.findUser = function(text, type) {
  return function(dispatch, getState) {
    dispatch({type: FIND_USER_REQUEST});

    console.log({text, type});
    return api.emit('player::findUser', {text, type}, function(data) {
      console.log('findUser', data);
      if(data.result) {
        dispatch({type: FIND_USER_SUCCESS, payload: data.results});
      }else {
        dispatch({type: FIND_USER_FAILED, payload: data.msg});
      }
    })
  }
}
