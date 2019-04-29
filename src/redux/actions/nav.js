import constants from '../constants';
const { SWITCH_NAV, REPLACE_NAV, BACK_NAV } = constants;
import { NavigationActions } from 'react-navigation';

export const switchNav = function switchNav(routeName, params = {}) {
  return { type: SWITCH_NAV, routeName, params };
};

export const replaceNav = function replaceNav(routeName) {
  return { type: REPLACE_NAV, routeName };
};

export const backNav = function backNav(key = null) {
  return { type: BACK_NAV, key };
};

export const switchToConverseApp = function switchToConverseApp(
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

export const openWebview = function openWebview(url) {
  return NavigationActions.navigate({ routeName: 'Webview', params: { url } });
};
