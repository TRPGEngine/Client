const immutable = require('immutable');

const initialState = immutable.fromJS({
  isLogin: false
})

module.exports = function ui(state = initialState, action) {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return state;
    case 'RECEIVED_LOGIN':
      console.log(action.payload);
      return state.set('isLogin', true);
    default:
      return state;
  }
}
