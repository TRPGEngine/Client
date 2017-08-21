const immutable = require('immutable');

const initialState = immutable.fromJS({
  showAlert: false,
  showAlertInfo: {},
  showLoading: false,
})

module.exports = function ui(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_ALERT':
      return state.set('showAlert', true).set('showAlertInfo', action.payload || {})
    case 'HIDE_ALERT':
      return state.set('showAlert', false).set('showAlertInfo', immutable.Map());
    case 'SHOW_LOADING':
      return state.set('showLoading', true);
    case 'HIDE_LOADING':
      return state.set('showLoading', false);
    default:
      return state;
  }
}
