const {
  SET_USER_SETTINGS,
  SET_SYSTEM_SETTINGS,
  UPDATE_NOTIFICATION_PERMISSION,
} = require('../constants');
const {showAlert} = require('./ui');
// const rnStorage = require('../../api/rnStorage.api.js');

exports.setUserSettings = function setUserSettings(payload) {
  return {type: SET_USER_SETTINGS, payload};
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

    dispatch({type: SET_SYSTEM_SETTINGS, payload});
  }
}

exports.setNotificationPermission = function setNotificationPermission(notification) {
  return {type: UPDATE_NOTIFICATION_PERMISSION, payload: notification};
}

exports.requestNotificationPermission = function requestNotificationPermission() {
  return function(dispatch, getState) {
    Notification.requestPermission(result => {
      console.log('授权结果', result);
      dispatch(exports.setNotificationPermission(result));

      if(result !== 'granted') {
        // 如果授权不成功, 则回退设置
        dispatch(exports.setSystemSettings({notification: false}));
      }
    })
  }
}
