const immutable = require('immutable');
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const {
  SET_TEMPLATE,
  CREATE_TEMPLATE_SUCCESS,
  UPDATE_TEMPLATE_SUCCESS,
} = require('../constants');
const { showLoading, hideLoading, showAlert } = require('./ui');

let setTemplate = function setTemplate(uuid, name, desc, avatar, info) {
  return {
    uuid,
    name,
    desc,
    avatar,
    info,
  }
}

let createTemplate = function createTemplate(name, desc, avatar, info) {
  return function(dispatch, getState) {
    dispatch(showLoading('创建中...'));
    return api.emit('actor::createTemplate', {name, desc, avatar, info}, function(data) {
      dispatch(hideLoading());
      dispatch(showAlert({title: '成功', content: '模板创建完毕'}));
      if(data.result) {
        dispatch({type:CREATE_TEMPLATE_SUCCESS, payload: data.template});
      }else {
        console.error(data.msg);
        dispatch(showAlert(data.msg));
        // dispatch({type:LOGIN_FAILED, payload: data.msg});
      }
    })
  }
}

let updateTemplate = function updateTemplate(uuid, name, desc, avatar, info) {
  return function(dispatch, getState) {
    dispatch(showLoading('保存中...'));
    return api.emit('actor::updateTemplate', {uuid, name, desc, avatar, info}, function(data) {
      dispatch(hideLoading());
      dispatch(showAlert({title: '成功', content: '模板更新完毕'}));
      if(data.result) {
        dispatch({type:UPDATE_TEMPLATE_SUCCESS, payload: data.template});
      }else {
        console.error(data.msg);
        dispatch(showAlert(data.msg));
      }
    })
  }
}

module.exports = {
  setTemplate,
  createTemplate,
  updateTemplate,
}
