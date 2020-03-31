import constants from '@redux/constants';
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
  modalStack: [],
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
      draft.modalStack = [];
      draft.showSlidePanel = false;
      draft.showSlidePanelInfo = initialState.showSlidePanelInfo;
      return;
    case SHOW_ALERT: {
      const showAlertInfo = action.payload || {};
      draft.showAlert = true;
      draft.showAlertInfo = showAlertInfo;
      return;
    }
    case HIDE_ALERT:
      draft.showAlert = false;
      draft.showAlertInfo = {};
      return;

    case SHOW_LOADING:
      draft.showLoading = true;
      draft.showLoadingText = action.text || '加载中...';
      return;

    case HIDE_LOADING:
      draft.showLoading = false;
      return;
    case SHOW_MODAL:
      draft.modalStack.push(action.payload);
      return;
    case HIDE_MODAL:
      draft.modalStack.pop();
      return;
    case SHOW_TOAST:
      draft.showToast = true;
      draft.showToastText = action.text || '';
      return;
    case HIDE_TOAST:
      draft.showToast = false;
      return;
    case SHOW_PROFILE_CARD:
      draft.showProfileCard = true;
      draft.showProfileCardUUID = action.uuid;
      return;

    case HIDE_PROFILE_CARD:
      draft.showProfileCard = false;
      return;

    case SHOW_SLIDE_PANEL:
      draft.showSlidePanel = true;
      draft.showSlidePanelInfo = action.payload;
      return;

    case HIDE_SLIDE_PANEL:
      draft.showSlidePanel = false;
      return;
    case SHOW_LIGHTBOX:
      draft.showLigthbox = true;
      draft.showLigthboxInfo = action.payload;
      return;
    case HIDE_LIGHTBOX:
      draft.showLigthbox = false;
      return;
    case SWITCH_MENU_PANNEL:
      draft.menuIndex = action.menuIndex;
      draft.menuPannel = action.payload;
      return;
    case SET_LAST_DICE_TYPE:
      draft.lastDiceType = action.payload;
      return;
    case CHANGE_NETWORK_STATE:
      draft.network = action.payload;
      return;
    case UPDATE_SOCKET_ID:
      draft.socketId = action.socketId;
      return;
  }
}, initialState);
