const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const {
  GET_TEMPLATE_SUCCESS,
  FIND_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE_SUCCESS,
  UPDATE_TEMPLATE_SUCCESS,
  SET_EDITED_TEMPLATE,
  SELECT_TEMPLATE,
  CREATE_ACTOR_SUCCESS,
  GET_ACTOR_SUCCESS,
  SELECT_ACTOR,
  REMOVE_ACTOR_SUCCESS,
  UPDATE_ACTOR_SUCCESS,
} = require('../constants');
const { showLoading, hideLoading, showAlert, hideAlert, hideModal } = require('./ui');

let setTemplate = function setTemplate(uuid, name, desc, avatar, info) {
  return {
    uuid,
    name,
    desc,
    avatar,
    info,
  }
}

let getTemplate = function getTemplate(uuid) {
  return function(dispatch, getState) {
    return api.emit('actor::getTemplate', {uuid}, function(data) {
      if(data.result) {
        let payload = uuid?data.template:data.templates;
        dispatch({type: GET_TEMPLATE_SUCCESS, uuid, payload})
      }else {
        console.error(data.msg);
      }
    })
  }
}

let findTemplate = function findTemplate(searchName) {
  return function (dispatch, getState) {
    return api.emit('actor::findTemplate', {name: searchName}, function(data) {
      console.log(data);
      if(data.result) {
        dispatch({type: FIND_TEMPLATE_SUCCESS, payload: data.templates});
      }else {
        console.error(data.msg);
      }
    })
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

let setEditedTemplate = function setEditedTemplate(obj) {
  return {type: SET_EDITED_TEMPLATE, payload: obj}
}

let selectTemplate = function selectTemplate(template) {
  return {type: SELECT_TEMPLATE, payload: template}
}

let createActor = function createActor(name, avatar, desc, info, template_uuid) {
  return function(dispatch, getState) {
    dispatch(showLoading('创建人物中，请稍后...'));
    return api.emit('actor::createActor', {name, avatar, desc, info, template_uuid}, function(data) {
      dispatch(hideLoading());
      dispatch(hideAlert());
      dispatch(hideModal());
      if(data.result) {
        dispatch({type: CREATE_ACTOR_SUCCESS, payload: data.actor});
      }else {
        dispatch(showAlert(data.msg));
        console.error(data.msg);
      }
    })
  }
}

let getActor = function getActor(uuid = '') {
  return function(dispatch, getState) {
    return api.emit('actor::getActor', {uuid}, function(data) {
      if(data.result) {
        let payload = uuid ? data.actor : data.actors;
        dispatch({type: GET_ACTOR_SUCCESS, uuid, payload})
      }else {
        console.error(data.msg);
      }
    });
  }
}

let selectActor = function selectActor(uuid) {
  return {type: SELECT_ACTOR, payload: uuid}
}

let removeActor = function removeActor(uuid) {
  return function(dispatch, getState) {
    return api.emit('actor::removeActor', {uuid}, function(data) {
      dispatch(hideAlert());
      if(data.result) {
        let payload = data.remove;
        dispatch({type: REMOVE_ACTOR_SUCCESS, uuid, payload})
      }else {
        console.error(data.msg);
      }
    });
  }
}

let updateActor = function updateActor(uuid, name, avatar, desc, info) {
  return function(dispatch, getState) {
    dispatch(showLoading('正在更新人物卡信息，请稍后...'));
    return api.emit('actor::updateActor', {uuid, name, avatar, desc, info}, function(data) {
      dispatch(hideLoading());
      dispatch(hideAlert());
      dispatch(hideModal());
      if(data.result) {
        dispatch({type: UPDATE_ACTOR_SUCCESS, payload: data.actor});
      }else {
        dispatch(showAlert(data.msg));
        console.error(data.msg);
      }
    })
  }
}

module.exports = {
  setTemplate,
  getTemplate,
  findTemplate,
  createTemplate,
  updateTemplate,
  setEditedTemplate,
  selectTemplate,
  createActor,
  getActor,
  selectActor,
  removeActor,
  updateActor,
}
