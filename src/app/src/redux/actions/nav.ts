import {
  SWITCH_NAV,
  REPLACE_NAV,
  BACK_NAV,
  BACK_TOP_NAV,
} from '../constants/nav';
import { NavigationActions } from 'react-navigation';
import { setConverseIsRead } from '@src/shared/redux/actions/chat';
import { ChatType } from '../../types/params';
import { TRPGAction } from '@src/shared/redux/types/redux';

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

export const openWebview = function openWebview(url: string) {
  return NavigationActions.navigate({ routeName: 'Webview', params: { url } });
};

/**
 * 切换到聊天页面
 * @param uuid 会话UUID
 * @param type 会话类型
 * @param name 会话名
 */
export const switchToChatScreen = function switchToChatScreen(
  uuid: string,
  type: ChatType,
  name: string
): TRPGAction {
  return function(dispatch, getState) {
    dispatch(backToTop());
    dispatch(setConverseIsRead(uuid));
    dispatch(
      switchNav('Chat', {
        uuid,
        type,
        name,
      })
    );
  };
};
