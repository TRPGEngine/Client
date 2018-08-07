const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const {
  GET_TEMPLATE_SUCCESS,
  FIND_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE_SUCCESS,
  UPDATE_TEMPLATE_SUCCESS,
  REMOVE_TEMPLATE_SUCCESS,
  SET_EDITED_TEMPLATE,
  SELECT_TEMPLATE,
  CREATE_ACTOR_SUCCESS,
  GET_ACTOR_SUCCESS,
  SELECT_ACTOR,
  REMOVE_ACTOR_SUCCESS,
  UPDATE_ACTOR_SUCCESS,
} = require('../constants');
const config = require('../../../config/project.config');
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

let createTemplateAdvanced = function createTemplateAdvanced(name, desc, avatar, info) {
  return function(dispatch, getState) {
    dispatch(showLoading('创建中...'));
    if(!name) {
      // 如果没有给模板名则从info里面取模板名
      try {
        let _data = JSON.parse(info);
        name = _data.name;
      }catch(err) {
        dispatch(hideLoading());
        dispatch(showAlert({title: '创建失败', content: '请检查输入模板信息'}));
        return;
      }
    }
    if(!desc) {
      // 如果没有给模板描述则从info里面取模板描述
      try {
        let _data = JSON.parse(info);
        desc = _data.desc;
      }catch(err) {
        dispatch(hideLoading());
        dispatch(showAlert({title: '创建失败', content: '请检查输入模板信息'}));
        return;
      }
    }

    return api.emit('actor::createTemplateAdvanced', {name, desc, avatar, info}, function(data) {
      dispatch(hideLoading());
      dispatch(hideModal());
      dispatch(showAlert({title: '成功', content: '模板创建完毕'}));
      if(data.result) {
        dispatch({type:CREATE_TEMPLATE_SUCCESS, payload: data.template});
      }else {
        console.error(data.msg);
        dispatch(showAlert(data.msg));
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

let removeTemplate = function removeTemplate(uuid) {
  return function(dispatch, getState) {
    dispatch(showLoading());
    return api.emit('actor::removeTemplate', {uuid}, function(data) {
      dispatch(hideLoading());
      dispatch(showAlert('模板删除成功'));
      if(data.result) {
        dispatch({type: REMOVE_TEMPLATE_SUCCESS, uuid})
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
        if(data.actors) {
          for (let i of payload) {
            i.avatar = config.file.getAbsolutePath(i.avatar);
          }
        }
        dispatch({type: GET_ACTOR_SUCCESS, uuid, payload});
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
        dispatch({type: REMOVE_ACTOR_SUCCESS, uuid})
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
        let actor = data.actor;
        actor.avatar = config.file.getAbsolutePath(actor.avatar);
        dispatch({type: UPDATE_ACTOR_SUCCESS, payload: actor});
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
  createTemplateAdvanced,
  updateTemplate,
  removeTemplate,
  setEditedTemplate,
  selectTemplate,
  createActor,
  getActor,
  selectActor,
  removeActor,
  updateActor,
}
