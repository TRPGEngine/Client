const immutable = require('immutable');
const {
  GET_USER_INFO,
  GET_USER_INFO_ERROR,
} = require('../constants');

const initialState = immutable.fromJS({
  user: {},
  actor: {},
});

module.exports = function cache(state = initialState, action) {
  switch (action.type) {
    case GET_USER_INFO:
      let payload = action.payload;
      let uuid = payload.uuid;
      return state.setIn(['user', uuid], immutable.fromJS(payload));
    default:
      return state;
  }

  return state;
}
