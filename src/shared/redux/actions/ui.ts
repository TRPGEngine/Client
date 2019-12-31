import constants from '../constants';
const {
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
import * as cache from './cache';
import { AlertPayload } from '../types/ui';
import { TRPGAction } from '../types/__all__';

export const showLoading = function(text = '加载中...'): TRPGAction {
  return { type: SHOW_LOADING, text: text };
};
export const hideLoading = function(): TRPGAction {
  return { type: HIDE_LOADING };
};
export const showAlert = function(payload: AlertPayload): TRPGAction {
  if (typeof payload === 'string') {
    payload = {
      content: payload,
    };
  }
  return { type: SHOW_ALERT, payload };
};
export const hideAlert = function(): TRPGAction {
  return { type: HIDE_ALERT };
};
export const showModal = function(body): TRPGAction {
  return { type: SHOW_MODAL, payload: body };
};
export const hideModal = function(): TRPGAction {
  return { type: HIDE_MODAL };
};

let toastTimer: number;
export const showToast = function(msg: string): TRPGAction {
  return (dispatch, getState) => {
    dispatch({ type: SHOW_TOAST, text: msg });

    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      dispatch({ type: HIDE_TOAST });
      toastTimer = null;
    }, 2000);
  };
};
export const hideToast = function(): TRPGAction {
  return { type: HIDE_TOAST };
};
export const showProfileCard = function(uuid?: string): TRPGAction {
  return (dispatch, getState) => {
    if (!uuid) {
      // 获取个人信息数据
      uuid = getState().user.info.uuid;
    }
    // 获取最新信息
    dispatch(cache.getUserInfo(uuid));

    dispatch({ type: SHOW_PROFILE_CARD, uuid });
  };
};
export const hideProfileCard = function(): TRPGAction {
  return { type: HIDE_PROFILE_CARD };
};
export const showSlidePanel = function(
  title: string,
  content: React.ReactNode
): TRPGAction {
  return { type: SHOW_SLIDE_PANEL, payload: { title, content } };
};
export const hideSlidePanel = function(): TRPGAction {
  return { type: HIDE_SLIDE_PANEL };
};
export const showLightbox = function(src: string): TRPGAction {
  return { type: SHOW_LIGHTBOX, payload: { src } };
};
export const hideLightbox = function(): TRPGAction {
  return { type: HIDE_LIGHTBOX };
};
export const switchMenuPannel = function(index, pannel = null): TRPGAction {
  return { type: SWITCH_MENU_PANNEL, menuIndex: index, payload: pannel };
};
export const setLastDiceType = function(type = 'basicDice'): TRPGAction {
  return { type: SET_LAST_DICE_TYPE, payload: type };
};
export const changeNetworkStatue = function(
  isOnline: boolean,
  msg: string,
  tryReconnect = false
): TRPGAction {
  return {
    type: CHANGE_NETWORK_STATE,
    payload: { isOnline, msg, tryReconnect },
  };
};

export const updateSocketId = function(socketId): TRPGAction {
  return { type: UPDATE_SOCKET_ID, socketId };
};
