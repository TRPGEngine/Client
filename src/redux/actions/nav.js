const { SWITCH_NAV, REPLACE_NAV, BACK_NAV } = require('../constants');
import { NavigationActions } from 'react-navigation';

exports.switchNav = function switchNav(routeName, params = {}) {
  return { type: SWITCH_NAV, routeName, params };
};

exports.replaceNav = function replaceNav(routeName) {
  return { type: REPLACE_NAV, routeName };
};

exports.backNav = function backNav(key = null) {
  return { type: BACK_NAV, key };
};

exports.switchToConverseApp = function switchToConverseApp(
  converseUUID,
  type = 'user',
  name
) {
  return function(dispatch, getState) {
    // 多级返回到首页
    dispatch(exports.backNav());
    dispatch(exports.backNav());
    dispatch(
      exports.switchNav('Chat', {
        uuid: converseUUID,
        type,
        name,
      })
    );
  };
};

exports.openWebview = function openWebview(url) {
  return NavigationActions.navigate({ routeName: 'Webview', params: { url } });
};
