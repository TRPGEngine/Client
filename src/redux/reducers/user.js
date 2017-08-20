const immutable = require('immutable');
const { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED } = require('../constants');

const initialState = immutable.fromJS({
  isLogin: false,
  info: {}
});

module.exports = function ui(state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return state;
    case LOGIN_SUCCESS:
      return state.set('isLogin', true).set('info', action.payload);
    case LOGIN_FAILED:
      return state.set('isLogin', false).set('info', {});
    default:
      return state;
  }

  return state;
}
