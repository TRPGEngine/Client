const immutable = require('immutable');
const {
  RESET,
  GET_USER_INFO,
  GET_TEMPLATE_INFO,
  GET_ACTOR_INFO,
} = require('../constants');

const initialState = immutable.fromJS({
  user: {},
  template: {},
  actor: {},
});

module.exports = function cache(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case GET_USER_INFO:
      return state.setIn(['user', action.payload.uuid], immutable.fromJS(action.payload));
    case GET_TEMPLATE_INFO:
      return state.setIn(['template', action.payload.uuid], immutable.fromJS(action.payload));
    case GET_ACTOR_INFO:
      return state.setIn(['actor', action.payload.uuid], immutable.fromJS(action.payload))
    default:
      return state;
  }
}
