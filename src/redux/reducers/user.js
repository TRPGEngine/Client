const immutable = require('immutable');
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
} = require('../constants');
const sessionStorage = require('../../api/sessionStorage.api.js');

const initialState = immutable.fromJS({
  isLogin: false,
  info: {},
  friendList: [],
  friendRequests: [],// 好友申请
  isFindingUser: false,// 好友查询页面
  findingResult: [],
});

module.exports = function ui(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return state;
    case LOGIN_SUCCESS:
      let {uuid, token} = action.payload;
      sessionStorage.set({uuid, token});
      return state.set('isLogin', true)
        .set('info', immutable.fromJS(action.payload));
    case LOGIN_FAILED:
      return state.set('isLogin', false).set('info', immutable.Map());
    case LOGOUT:
      sessionStorage.remove('uuid').remove('token');
      return state.set('isLogin', false).set('info', immutable.Map());
    case REGISTER_REQUEST:
    case REGISTER_FAILED:
    case REGISTER_SUCCESS:
      return state;
    case FIND_USER_REQUEST:
      return state.set('isFindingUser', true);
    case FIND_USER_SUCCESS:
    case FIND_USER_FAILED:
      return state.set('isFindingUser', false).set('findingResult', immutable.fromJS(action.payload || []))
    case ADD_FRIEND_SUCCESS:
      let friendUUID = action.friendUUID;
      return state.update('friendList', (list) => {
        if(list.indexOf(friendUUID) === -1) {
          return list.push(friendUUID);
        }else {
          return list;
        }
      })
    case GET_FRIENDS_SUCCESS:
      return state.set('friendList', immutable.fromJS(action.payload));
    default:
      return state;
  }

  return state;
}
