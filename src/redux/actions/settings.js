const {
  SET_USER_SETTINGS,
  SET_SYSTEM_SETTINGS,
  UPDATE_NOTIFICATION_PERMISSION,
  ADD_FAVORITE_DICE,
  UPDATE_FAVORITE_DICE,
} = require('../constants');
const {showAlert} = require('./ui');
const rnStorage = require('../../api/rnStorage.api.js');

exports.setUserSettings = function setUserSettings(payload) {
  return function(dispatch, getState) {
    rnStorage.save('userSettings', getState().getIn(['settings', 'user']).merge(payload)); // 异步
    dispatch({type: SET_USER_SETTINGS, payload});
  }
}

exports.setSystemSettings = function setSystemSettings(payload) {
  return function(dispatch, getState) {
    if(payload.notification !== undefined && payload.notification === true) {
      if(Notification.permission === 'denied') {
        dispatch(showAlert('桌面通知权限已被禁止, 请手动修改后刷新应用'))
        payload.notification = false;
      } else if(Notification.permission === 'default') {
        dispatch(exports.requestNotificationPermission());
      }
    }

    rnStorage.save('systemSettings', getState().getIn(['settings', 'system']).merge(payload)); // 异步
    dispatch({type: SET_SYSTEM_SETTINGS, payload});
  }
}

exports.setNotificationPermission = function setNotificationPermission(notification) {
  return {type: UPDATE_NOTIFICATION_PERMISSION, payload: notification};
}

exports.requestNotificationPermission = function requestNotificationPermission() {
  return function(dispatch, getState) {
    Notification.requestPermission(result => {
      console.log('授权结果:', result);
      dispatch(exports.setNotificationPermission(result));

      if(result !== 'granted') {
        // 如果授权不成功, 则回退设置
        dispatch(exports.setSystemSettings({notification: false}));
      }
    })
  }
}

exports.addFavoriteDice = function addFavoriteDice() {
  return {type: ADD_FAVORITE_DICE};
}

exports.updateFavoriteDice = function updateFavoriteDice(index, payload) {
  return {type: UPDATE_FAVORITE_DICE, index, payload}
}
