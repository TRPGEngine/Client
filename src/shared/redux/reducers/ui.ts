import constants from '@redux/constants';
import immutable from 'immutable';
import { UIState } from '@redux/types/ui';
import { produce } from 'immer';

const {
  RESET,
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_MODAL,
  HIDE_MODAL,
  SHOW_TOAST,
  HIDE_TOAST,
  SHOW_PROFILE_CARD,
  HIDE_PROFILE_CARD,
  SHOW_SLIDE_PANEL,
  HIDE_SLIDE_PANEL,
  SHOW_LIGHTBOX,
  HIDE_LIGHTBOX,
  SWITCH_MENU_PANNEL,
  SET_LAST_DICE_TYPE,
  CHANGE_NETWORK_STATE,
  UPDATE_SOCKET_ID,
} = constants;

const initialState: UIState = {
  showAlert: false,
  showAlertInfo: {},
  showLoading: false,
  showLoadingText: '加载中...',
  showModal: false,
  showModalBody: undefined,
  showToast: false,
  showToastText: '',
  showProfileCard: false,
  showProfileCardUUID: '',
  showSlidePanel: false,
  showSlidePanelInfo: {
    title: '',
    content: '',
  },
  showLigthbox: false,
  showLigthboxInfo: {},
  menuIndex: 0,
  menuPannel: null,
  network: {
    isOnline: false,
    tryReconnect: false,
    msg: '',
  },
  socketId: '',
  lastDiceType: 'basicDice',
};

export default produce((draft: UIState, action) => {
  switch (action.type) {
    case RESET:
      draft.showModal = false;
      draft.showSlidePanel = false;
      draft.showSlidePanelInfo = initialState.showSlidePanelInfo;
      return;
    // return state
    //   .set('showModal', false)
    //   .set('showSlidePanel', false)
    //   .set('showSlidePanelInfo', initialState.get('showSlidePanelInfo'));
    case SHOW_ALERT: {
      const showAlertInfo = action.payload || {};
      draft.showAlert = true;
      draft.showAlertInfo = showAlertInfo;
      return;
      // return state
      //   .set('showAlert', true)
      //   .set('showAlertInfo', immutable.fromJS(showAlertInfo));
    }
    case HIDE_ALERT:
      draft.showAlert = false;
      draft.showAlertInfo = {};
      return;

    // return state
    //   .set('showAlert', false)
    //   .set('showAlertInfo', immutable.Map());
    case SHOW_LOADING:
      draft.showLoading = true;
      draft.showLoadingText = action.text || '加载中...';
      return;

    // return state
    //   .set('showLoading', true)
    //   .set('showLoadingText', action.text || '加载中...');
    case HIDE_LOADING:
      draft.showLoading = false;
      return;
    // return state.set('showLoading', false);
    case SHOW_MODAL:
      draft.showModal = true;
      draft.showModalBody = action.payload;
      return;

    // return state
    //   .set('showModal', true)
    //   .set('showModalBody', immutable.fromJS(action.payload));
    case HIDE_MODAL:
      draft.showModal = false;
      draft.showModalBody = undefined;
      return;
    // return state.set('showModal', false).set('showModalBody', undefined);
    case SHOW_TOAST:
      draft.showToast = true;
      draft.showToastText = action.text || '';
      return;
    // return state
    //   .set('showToast', true)
    //   .set('showToastText', action.text || '');
    case HIDE_TOAST:
      draft.showToast = false;
      return;
    // return state.set('showToast', false);
    case SHOW_PROFILE_CARD:
      draft.showProfileCard = true;
      draft.showProfileCardUUID = action.uuid;
      return;

    // return state
    //   .set('showProfileCard', true)
    //   .set('showProfileCardUUID', action.uuid);
    case HIDE_PROFILE_CARD:
      draft.showProfileCard = false;
      return;

    // return state.set('showProfileCard', false);
    case SHOW_SLIDE_PANEL:
      draft.showSlidePanel = true;
      draft.showSlidePanelInfo = action.payload;
      return;

    // return state
    //   .set('showSlidePanel', true)
    //   .set('showSlidePanelInfo', immutable.fromJS(action.payload));
    case HIDE_SLIDE_PANEL:
      draft.showSlidePanel = false;
      return;
    // return state.set('showSlidePanel', false);
    case SHOW_LIGHTBOX:
      draft.showLigthbox = true;
      draft.showLigthboxInfo = action.payload;
      return;
    // return state
    //   .set('showLigthbox', true)
    //   .set('showLigthboxInfo', immutable.fromJS(action.payload));
    case HIDE_LIGHTBOX:
      draft.showLigthbox = false;
      return;
    // return state.set('showLigthbox', false);
    case SWITCH_MENU_PANNEL:
      draft.menuIndex = action.menuIndex;
      draft.menuPannel = action.payload;
      return;
    // return state
    //   .set('menuIndex', action.menuIndex)
    //   .set('menuPannel', action.payload);
    case SET_LAST_DICE_TYPE:
      draft.lastDiceType = action.payload;
      return;
    // return state.set('lastDiceType', action.payload);
    case CHANGE_NETWORK_STATE:
      draft.network = action.payload;
      return;
    // return state.set('network', immutable.fromJS(action.payload));
    case UPDATE_SOCKET_ID:
      draft.socketId = action.socketId;
      return;
    // return state.set('socketId', action.socketId);
  }
}, initialState);
