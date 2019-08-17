import constants from '../constants';
import immutable, { Record } from 'immutable';

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

export type UIState = Record<{
  showAlert: boolean;
  showAlertInfo: any;
  showLoading: boolean;
  showLoadingText: string;
  showModal: boolean;
  showModalBody: any;
  showToast: boolean;
  showToastText: string;
  showProfileCard: boolean;
  showProfileCardUUID: string;
  showSlidePanel: boolean;
  showSlidePanelInfo: Record<{
    title: string;
    content: string;
  }>;
  showLigthbox: boolean;
  showLigthboxInfo: any;
  menuIndex: number;
  menuPannel: any;
  network: Record<{
    isOnline: boolean;
    tryReconnect: boolean;
    msg: string;
  }>;
  socketId: string;
  lastDiceType: string;
}>;

const initialState: UIState = immutable.fromJS({
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
});

export default function ui(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return state
        .set('showModal', false)
        .set('showSlidePanel', false)
        .set('showSlidePanelInfo', initialState.get('showSlidePanelInfo'));
    case SHOW_ALERT: {
      let showAlertInfo = action.payload || {};
      return state
        .set('showAlert', true)
        .set('showAlertInfo', immutable.fromJS(showAlertInfo));
    }
    case HIDE_ALERT:
      return state
        .set('showAlert', false)
        .set('showAlertInfo', immutable.Map());
    case SHOW_LOADING:
      return state
        .set('showLoading', true)
        .set('showLoadingText', action.text || '加载中...');
    case HIDE_LOADING:
      return state.set('showLoading', false);
    case SHOW_MODAL:
      return state
        .set('showModal', true)
        .set('showModalBody', immutable.fromJS(action.payload));
    case HIDE_MODAL:
      return state.set('showModal', false).set('showModalBody', undefined);
    case SHOW_TOAST:
      return state
        .set('showToast', true)
        .set('showToastText', action.text || '');
    case HIDE_TOAST:
      return state.set('showToast', false);
    case SHOW_PROFILE_CARD:
      return state
        .set('showProfileCard', true)
        .set('showProfileCardUUID', action.uuid);
    case HIDE_PROFILE_CARD:
      return state.set('showProfileCard', false);
    case SHOW_SLIDE_PANEL:
      return state
        .set('showSlidePanel', true)
        .set('showSlidePanelInfo', immutable.fromJS(action.payload));
    case HIDE_SLIDE_PANEL:
      return state.set('showSlidePanel', false);
    case SHOW_LIGHTBOX:
      return state
        .set('showLigthbox', true)
        .set('showLigthboxInfo', immutable.fromJS(action.payload));
    case HIDE_LIGHTBOX:
      return state.set('showLigthbox', false);
    case SWITCH_MENU_PANNEL:
      return state
        .set('menuIndex', action.menuIndex)
        .set('menuPannel', action.payload);
    case SET_LAST_DICE_TYPE:
      return state.set('lastDiceType', action.payload);
    case CHANGE_NETWORK_STATE:
      return state.set('network', immutable.fromJS(action.payload));
    case UPDATE_SOCKET_ID:
      return state.set('socketId', action.socketId);
    default:
      return state;
  }
}
