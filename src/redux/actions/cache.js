const {
  GET_USER_INFO,
  GET_TEMPLATE_INFO,
  GET_ACTOR_INFO,
} = require('../constants');
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
        console.error(data.msg);
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

exports.getActorInfo = function(uuid) {
  if(!uuid) {
    throw new Error('getActorInfo need uuid');
  }

  return function(dispatch, getState) {
    return api.emit('actor::getActor', {uuid}, function(data) {
      if(data.result) {
        let actor = data.actor ? data.actor : data.actors[0];
        dispatch({type:GET_ACTOR_INFO, payload: actor});
      }else {
        console.error(data.msg)
      }
    })
  }
}
