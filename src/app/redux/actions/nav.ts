import {
  SWITCH_NAV,
  REPLACE_NAV,
  BACK_NAV,
  BACK_TOP_NAV,
} from '../constants/nav';
import { NavigationActions } from 'react-navigation';
import { switchConverse } from '@redux/actions/chat';

/**
 * 跳转到新的页面
 * @param routeName 路由名
 * @param params 路由参数, 可选
 */
export const switchNav = function switchNav(routeName: string, params = {}) {
  return { type: SWITCH_NAV, routeName, params };
};

/**
 * 覆盖当前路由
 * @param routeName 路由名
 */
export const replaceNav = function replaceNav(routeName: string) {
  return { type: REPLACE_NAV, routeName };
};

/**
 * 返回上一级路由
 * @param key 路由唯一标识
 */
export const backNav = function backNav(key = null) {
  return { type: BACK_NAV, key };
};

/**
 * 关闭所有页面返回到主屏幕
 */
export const backToTop = function backToTop() {
  return { type: BACK_TOP_NAV };
};

/** 切换到聊天页面 */
export const switchToConverseApp = function switchToConverseApp(
  converseUUID: string,
  type: 'user' | 'group' = 'user',
  name: string
) {
  return function(dispatch, getState) {
    // 多级返回到首页
    dispatch(backNav());
    dispatch(backNav());
    dispatch(switchConverse(converseUUID));
    dispatch(
      switchNav('Chat', {
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
