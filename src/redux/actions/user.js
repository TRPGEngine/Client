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
const trpgApi = require('../../api/trpg.api.js');
const api = trpgApi.getInstance();
const { hideLoading, showAlert } = require('./ui');
const { checkUser } = require('../../utils/usercache');

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
    return api.emit('player::invite', {to: uuid}, function(data) {
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
