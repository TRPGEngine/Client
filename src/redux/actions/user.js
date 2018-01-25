const {
  RESET,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_TOKEN_SUCCESS,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  FIND_USER_REQUEST,
  FIND_USER_SUCCESS,
  FIND_USER_FAILED,
  UPDATE_INFO_SUCCESS,
  ADD_FRIEND_SUCCESS,
  ADD_FRIEND_FAILED,
  GET_FRIENDS_REQUEST,
  GET_FRIENDS_SUCCESS,
  GET_FRIENDS_FAILED,
  SEND_FRIEND_INVITE_SUCCESS,
  SEND_FRIEND_INVITE_ERROR,
  AGREE_FRIEND_INVITE_SUCCESS,
  AGREE_FRIEND_INVITE_ERROR,
  GET_FRIEND_INVITE_SUCCESS,
  GET_FRIEND_INVITE_ERROR,
  REFUSE_FRIEND_INVITE_SUCCESS,
  REFUSE_FRIEND_INVITE_ERROR,
  ADD_FRIEND_INVITE,
} = require('../constants');
const md5 = require('md5');
const trpgApi = require('../../api/trpg.api.js');
const rnStorage = require('../../api/rnStorage.api.js');
const config = require('../../../config/project.config');
const api = trpgApi.getInstance();
const { showLoading, hideLoading, showAlert } = require('./ui');
const { checkUser } = require('../../utils/usercache');


function loginSuccess(dispatch, getState) {
  if(!dispatch || !getState) {
    return;
  }

  const { getConverses } = require('./chat');
  const { getFriends, getFriendsInvite } = require('./user');
  const { getTemplate, getActor } = require('./actor');
  const { getGroupList, getGroupInvite } = require('./group');
  const { getNote } = require('./note');

  dispatch(getConverses())
  dispatch(getFriends())
  dispatch(getFriendsInvite())
  dispatch(getTemplate())
  dispatch(getActor())
  dispatch(getGroupList())
  dispatch(getGroupInvite())
  dispatch(getNote())
}

exports.login = function(username, password, cb) {
  return function(dispatch, getState) {
    password = md5(password);
    let isApp = config.platform === 'app';
    dispatch({type:LOGIN_REQUEST});
    return api.emit('player::login', {username, password, platform: config.platform, isApp}, function(data) {
      dispatch(hideLoading());

      if(data.result) {
        let {uuid, token, app_token} = data.info;
        if(isApp) {
          rnStorage.set({uuid, token: app_token});
        }else {
          rnStorage.set({uuid, token});
        }
        dispatch({type:LOGIN_SUCCESS, payload: data.info, isApp});
        loginSuccess(dispatch, getState); // 获取用户信息
      }else {
        rnStorage.remove('uuid');
        rnStorage.remove('token');
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

exports.loginWithToken = function(uuid, token) {
  return function(dispatch, getState) {
    let isApp = config.platform === 'app';
    return api.emit('player::loginWithToken', {uuid, token, platform: config.platform, isApp}, function(data) {
      if(data.result) {
        dispatch({type:LOGIN_TOKEN_SUCCESS, payload: data.info, isApp});
        loginSuccess(dispatch, getState); // 获取用户信息
      }else {
        console.log(data);
        if(getState().getIn(['user', 'isLogin'])) {
          // 登录超时
          dispatch({type:RESET});// 登录超时以后重置数据内容。需要重新获取
          dispatch({type:LOGIN_FAILED, payload: data.msg});
          dispatch(showAlert({
            type: 'alert',
            title: '登录失败',
            content: '您的登录已超时，请重新登录',
          }));
        }
      }
    })
  }
}

exports.logout = function() {
  let isApp = config.platform === 'app';
  return function(dispatch, getState) {
    let info = getState().getIn(['user','info']);
    let uuid = info.get('uuid');
    let token = isApp ? info.get('app_token') : info.get('token');
    dispatch(showLoading());
    dispatch({type: LOGOUT});
    api.emit('player::logout', {uuid, token, isApp} , function(data) {
      dispatch(hideLoading());
      if(data.result) {
        rnStorage.remove('uuid');
        rnStorage.remove('token');
        dispatch({type: RESET});
      }else {
        dispatch(showAlert(data.msg));
      }
    })
  }
}

exports.register = function(username, password, onSuccess) {
  password = md5(password);
  return function(dispatch, getState) {
    dispatch({type:REGISTER_REQUEST});
    return api.emit('player::register', {username, password}, function(data) {
      dispatch(hideLoading());
      console.log(data);
      if(data.result) {
        dispatch({type:REGISTER_SUCCESS, payload: data.results});
        onSuccess && onSuccess();
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
        let list = data.results;
        if(list && list.length>0) {
          for (let user of list) {
            let uuid = user.uuid;
            if(!!uuid) {
              checkUser(uuid);
            }
          }
        }
        dispatch({type: FIND_USER_SUCCESS, payload: list});
      }else {
        dispatch({type: FIND_USER_FAILED, payload: data.msg});
      }
    })
  }
}

exports.updateInfo = function(updatedData) {
  return function(dispatch, getState) {
    return api.emit('player::updateInfo', updatedData, function(data) {
      if(data.result) {
        dispatch({type: UPDATE_INFO_SUCCESS, payload: data.user});
      }else {
        console.error(data.msg);
      }
    })
  }
}

exports.changePassword = function(oldPassword, newPassword, success, error) {
  oldPassword = md5(oldPassword);
  newPassword = md5(newPassword);
  return function(dispatch, getState) {
    return api.emit('player::changePassword', {oldPassword, newPassword}, function(data) {
      if(data.result) {
        // TODO
        success();
        // dispatch({type: UPDATE_INFO_SUCCESS, payload: data.user});
      }else {
        console.error(data.msg);
        error(data.msg);
      }
    })
  }
}

exports.addFriend = function(uuid) {
  return function(dispatch, getState) {
    console.log('addFriend:', uuid);
    return api.emit('player::addFriend', {uuid}, function(data) {
      if(data.result) {
        dispatch({type: ADD_FRIEND_SUCCESS, friendUUID: uuid});
      }else {
        console.error(data.msg);
        dispatch({type: ADD_FRIEND_FAILED, payload: data.msg});
      }
    });
  }
}

exports.getFriends = function() {
  return function(dispatch, getState) {
    dispatch({type: GET_FRIENDS_REQUEST});
    return api.emit('player::getFriends', {}, function(data) {
      if(data.result) {
        let uuidList = [];
        for (let item of data.list) {
          let uuid = item.uuid
          uuidList.push(uuid);
          checkUser(uuid);
        }

        dispatch({type: GET_FRIENDS_SUCCESS, payload: uuidList});
      }else {
        dispatch({type: GET_FRIENDS_FAILED, payload: data.msg});
      }
    })
  }
}

exports.sendFriendInvite = function(uuid) {
  return function(dispatch, getState) {
    return api.emit('player::sendFriendInvite', {to: uuid}, function(data) {
      if(data.result) {
        dispatch({type: SEND_FRIEND_INVITE_SUCCESS, payload: data.invite, uuid});
      }else {
        dispatch({type: SEND_FRIEND_INVITE_ERROR, payload: data.msg});
      }
    })
  }
}

exports.agreeFriendInvite = function(inviteUUID) {
  return function(dispatch, getState) {
    return api.emit('player::agreeFriendInvite', {uuid: inviteUUID}, function(data) {
      if(data.result) {
        dispatch({type: AGREE_FRIEND_INVITE_SUCCESS, payload: data.res});
      }else {
        dispatch({type: AGREE_FRIEND_INVITE_ERROR, payload: data.msg});
      }
    })
  }
}

exports.getFriendsInvite = function() {
  return function(dispatch, getState) {
    return api.emit('player::getFriendsInvite', {}, function(data) {
      if(data.result) {
        for (let item of data.res) {
          checkUser(item.from_uuid);
        }
        dispatch({type: GET_FRIEND_INVITE_SUCCESS, payload: data.res});
      }else {
        dispatch({type: GET_FRIEND_INVITE_ERROR, payload: data.msg});
      }
    })
  }
}

exports.refuseFriendInvite = function(inviteUUID) {
  return function(dispatch, getState) {
    return api.emit('player::refuseFriendInvite', {uuid: inviteUUID}, function(data) {
      if(data.result) {
        dispatch({type: REFUSE_FRIEND_INVITE_SUCCESS, payload: data.res});
      }else {
        dispatch({type: REFUSE_FRIEND_INVITE_ERROR, payload: data.msg});
      }
    })
  }
}

exports.addFriendInvite = function(invite) {
  return {type: ADD_FRIEND_INVITE, payload: invite}
}
