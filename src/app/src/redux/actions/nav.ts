import {
  SWITCH_NAV,
  REPLACE_NAV,
  BACK_NAV,
  BACK_TOP_NAV,
} from '../constants/nav';
import { NavigationActions } from 'react-navigation';
import { switchConverse } from '@src/shared/redux/actions/chat';
import { ChatType } from '../../types/params';
import { TRPGAction } from '@src/shared/redux/types/__all__';
import config from '@src/shared/project.config';
import rnStorage from '@src/shared/api/rn-storage.api';
import _get from 'lodash/get';

import * as trpgApi from '@shared/api/trpg.api';
import { getWebToken } from '@shared/utils/portal-helper';
import { switchSelectGroup } from '@redux/actions/group';
import { CommonActions } from '@react-navigation/native';
const api = trpgApi.getInstance();

/**
 * TODO: 这里所有的操作都会被弃用
 * 改用在组件内部使用
 */

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
    dispatch(switchConverse(uuid)); // 切换会话uuid. 所有的会话。不管是group还是user。共用一个会话UUID
    if (type === 'group') {
      // 如果为团则设定当前选择的团
      dispatch(switchSelectGroup(uuid));
    } else {
      dispatch(switchSelectGroup(''));
    }
    dispatch(
      switchNav('Chat', {
        uuid,
        type,
        name,
      })
    );
  };
};

export const navProfile = function navProfile(uuid: string, name: string) {
  return switchNav('Profile', {
    uuid,
    type: 'user',
    name,
  });
};

export const navPortal = function navPortal(url: string): TRPGAction {
  return async function(dispatch, getState) {
    const portalUrl = config.url.portal;

    const userUUID = _get(getState(), ['user', 'info', 'uuid']);
    const jwt = await getWebToken(userUUID);

    url = url.startsWith(portalUrl) ? url : portalUrl + url;

    // const injectedJavaScript = `location.href.indexOf('${portalUrl}') === 0 && window.localStorage.setItem('jwt', '${jwt}')`;
    const injectedJavaScript = `(function(){
      if(location.href.indexOf('${portalUrl}') !== 0) {
        return;
      }
      let token = window.localStorage.getItem('jwt');
      if(!token || (token && token != '${jwt}')){
        window.localStorage.setItem('jwt', '${jwt}');
        window.location.reload();
      }
    })();`;

    dispatch(
      switchNav('Webview', {
        url,
        injectedJavaScript,
      })
    );
  };
};

/**
 * 打开一个新的页面来选择用户
 * @param allUUIDList 所有的UUID列表
 * @param callback 回调
 * @param extraParams 其他参数
 */
export const selectUser = function(
  allUUIDList: string[],
  callback: (selectedUUID: string[]) => void,
  extraParams?: {
    title?: string;
  }
): TRPGAction {
  return async function(dispatch, getState) {
    dispatch(
      switchNav('UserSelect', {
        uuids: allUUIDList,
        onSelected: callback,
        ...extraParams,
      })
    );
  };
};

export function resetScreenAction(routeName: string) {
  return CommonActions.reset({
    index: 0,
    routes: [
      {
        name: routeName,
      },
    ],
  });
}
