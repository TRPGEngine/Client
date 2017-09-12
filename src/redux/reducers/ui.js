const {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_MODAL,
  HIDE_MODAL,
  SHOW_INFO_CARD,
  HIDE_INFO_CARD,
  SHOW_PROFILE_CARD,
  HIDE_PROFILE_CARD,
  SWITCH_MENU,
  CHANGE_NETWORK_STATE,
} = require('../constants');
const immutable = require('immutable');

const initialState = immutable.fromJS({
  showAlert: false,
  showAlertInfo: {},
  showLoading: false,
  showModal: false,
  showModalBody: undefined,
  showInfoCard: false,
  showInfoCardUUID: '',
  showProfileCard: false,
  menuIndex: 0,
  network: {
    isOnline: false,
    tryReconnect: false,
    msg: '',
  }
})

module.exports = function ui(state = initialState, action) {
  switch (action.type) {
    case SHOW_ALERT:
      let showAlertInfo = action.payload || {};
      return state.set('showAlert', true).set('showAlertInfo', immutable.fromJS(showAlertInfo));
    case HIDE_ALERT:
      return state.set('showAlert', false).set('showAlertInfo', immutable.Map());
    case SHOW_LOADING:
      return state.set('showLoading', true);
    case HIDE_LOADING:
      return state.set('showLoading', false);
    case SHOW_MODAL:
      return state.set('showModal', true).set('showModalBody', immutable.fromJS(action.payload));
    case HIDE_MODAL:
      return state.set('showModal', false).set('showModalBody', undefined);
    case SHOW_INFO_CARD:
      let uuid = action.uuid || {};
      return state.set('showInfoCard', true).set('showInfoCardUUID', uuid);
    case HIDE_INFO_CARD:
      return state.set('showInfoCard', false);
    case SHOW_PROFILE_CARD:
      return state.set('showProfileCard', true);
    case HIDE_PROFILE_CARD:
      return state.set('showProfileCard', false);
    case SWITCH_MENU:
      return state.set('menuIndex', action.menuIndex);
    case CHANGE_NETWORK_STATE:
      return state.set('network', immutable.fromJS(action.payload));
    default:
      return state;
  }
}
