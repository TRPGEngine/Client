import { TRPGAction } from '@redux/types/__all__';
import { getWebToken } from '@shared/utils/portal-helper';
import { showSlidePanel } from '@redux/actions/ui';
import Webview from '@web/components/Webview';
import React from 'react';
import config from '@shared/project.config';

/**
 * 显示portal页面
 * @param url portal地址
 */
export const showPortal = (url: string): TRPGAction => {
  return async function(dispatch, getState) {
    const userUUID = getState().getIn(['user', 'info', 'uuid']);

    const jwt = await getWebToken(userUUID); // 检查WebToken

    // 将获取到的当前用户的WebToken设置到jwt上。jwt为portal需要使用的localStorage
    window.localStorage.setItem('jwt', jwt);

    const portalUrl = config.url.portal;
    url = url.startsWith(portalUrl) ? url : portalUrl + url;

    dispatch(showSlidePanel('', React.createElement(Webview, { src: url })));
  };
};
