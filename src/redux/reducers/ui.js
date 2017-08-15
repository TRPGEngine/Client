const immutable = require('immutable');

const initialState = immutable.fromJS({
  showAlert: false,
  showAlertContent: '',
  showLoading: false,
})

module.exports = function ui(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_ALERT':
      return state.set('showAlert', true).set('showAlertContent', action.content || '');
    case 'HIDE_ALERT':
      return state.set('showAlert', false);
    case 'SHOW_LOADING':
      return state.set('showLoading', true);
    case 'HIDE_LOADING':
      return state.set('showLoading', false);
    default:
      return state;
  }
}
