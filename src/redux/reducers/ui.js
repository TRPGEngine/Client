const immutable = require('immutable');

const initialState = immutable.fromJS({
  showAlert: false,
  showAlertContent: '',
})

module.exports = function ui(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_ALERT':
      return state.set('showAlert', true).set('showAlertContent', action.content || '');
    case 'HIDE_ALERT':
      return state.set('showAlert', false);
    default:
      return state;
  }
}
