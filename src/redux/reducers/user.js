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
} = require('../constants');
const sessionStorage = require('../../api/sessionStorage.api.js');

const initialState = immutable.fromJS({
  isLogin: false,
  info: {},
  friendList: [
    'd0e29b30-8e27-11e7-a683-8f6999c64aab',
    'd0e29b30-8e27-11e7-a683-8f6999c64aab',
    'd0e29b30-8e27-11e7-a683-8f6999c64aab',
    'd0e29b30-8e27-11e7-a683-8f6999c64aab',
    'd0e29b30-8e27-11e7-a683-8f6999c64aab',
    'd0e29b30-8e27-11e7-a683-8f6999c64aab',
    'd0e29b30-8e27-11e7-a683-8f6999c64aab',
    'd0e29b30-8e27-11e7-a683-8f6999c64aab',
    'd0e29b30-8e27-11e7-a683-8f6999c64aab',
  ],
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
    default:
      return state;
  }

  return state;
}
