const {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_INFO_CARD,
  HIDE_INFO_CARD,
} = require('../constants');
const immutable = require('immutable');

const initialState = immutable.fromJS({
  showAlert: false,
  showAlertInfo: {},
  showLoading: false,
  showInfoCard: false,
  infoCard: {
    name: '演示名',
    avatar: '',
    uuid: 'asdasdsadqwdqw'
  }
})

module.exports = function ui(state = initialState, action) {
  switch (action.type) {
    case SHOW_ALERT:
      return state.set('showAlert', true).set('showAlertInfo', action.payload || {})
    case HIDE_ALERT:
      return state.set('showAlert', false).set('showAlertInfo', immutable.Map());
    case SHOW_LOADING:
      return state.set('showLoading', true);
    case HIDE_LOADING:
      return state.set('showLoading', false);
    case SHOW_INFO_CARD:
      let info = action.payload || {};
      return state.set('showInfoCard', true).set('infoCard', immutable.fromJS(info));
    case HIDE_INFO_CARD:
      return state.set('showInfoCard', false);
    default:
      return state;
  }
}
