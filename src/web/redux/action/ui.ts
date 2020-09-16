import { TRPGAction } from '@redux/types/__all__';
import { showSlidePanel } from '@redux/actions/ui';
import Webview from '@web/components/Webview';
import React from 'react';
import StandaloneWindow, {
  StandaloneWindowConfig,
} from '@web/components/StandaloneWindow';
import { getPortalUrl } from '@shared/utils/string-helper';
import _isString from 'lodash/isString';
import { getUserJWT } from '@shared/utils/jwt-helper';

type PortalPreviewType = 'slidepanel' | 'standalonewindow';

/**
 * 显示portal页面
 * @param url portal地址
 */
export const showPortal = (
  url: string,
  type: PortalPreviewType = 'slidepanel',
  options?: Omit<StandaloneWindowConfig, 'body'>
): TRPGAction => {
  return async function(dispatch, getState) {
    const jwt = await getUserJWT(); // 检查WebToken

    // 将获取到的当前用户的WebToken设置到jwt上。jwt为portal需要使用的localStorage
    if (_isString(jwt)) {
      window.localStorage.setItem('jwt', jwt);
    }

    const node = React.createElement(Webview, { src: getPortalUrl(url) });

    if (type === 'slidepanel') {
      dispatch(showSlidePanel('', node));
    } else if (type === 'standalonewindow') {
      StandaloneWindow.open!({
        ...options,
        body: node,
      });
    }
  };
};
