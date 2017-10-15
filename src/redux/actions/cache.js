const {
  GET_USER_INFO,
  GET_USER_INFO_ERROR,
  GET_TEMPLATE_INFO,
} = require('../constants');
const immutable = require('immutable');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();

exports.getUserInfo = function(uuid) {
  if(!uuid) {
    throw new Error('getUserInfo need uuid');
  }

  return function(dispatch, getState) {
    return api.emit('player::getInfo', {type:'user', uuid}, function(data) {
      if(data.result) {
        dispatch({type:GET_USER_INFO, payload: data.info});
      }else {
        dispatch({type:GET_USER_INFO_ERROR, payload: data.msg});
      }
    })
  }
}

exports.getTemplateInfo = function(uuid) {
  if(!uuid) {
    throw new Error('getTemplateInfo need uuid');
  }

  return function(dispatch, getState) {
    return api.emit('actor::getTemplate', {uuid}, function(data) {
      if(data.result) {
        dispatch({type:GET_TEMPLATE_INFO, payload: data.template});
      }else {
        console.error(data.msg)
      }
    })
  }
}
