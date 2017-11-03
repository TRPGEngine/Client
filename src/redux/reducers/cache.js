const immutable = require('immutable');
const {
  RESET,
  GET_USER_INFO,
  GET_USER_INFO_ERROR,
  GET_TEMPLATE_INFO,
} = require('../constants');

const initialState = immutable.fromJS({
  user: {},
  actor: {},
  template: {},
});

module.exports = function cache(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case GET_USER_INFO:
      let payload = action.payload;
      let uuid = payload.uuid;
      return state.setIn(['user', uuid], immutable.fromJS(payload));
    case GET_TEMPLATE_INFO:
      return state.setIn(['template', action.payload.uuid], immutable.fromJS(action.payload));
    default:
      return state;
  }

  return state;
}
