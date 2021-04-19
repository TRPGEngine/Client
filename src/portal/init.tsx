import { message } from 'antd';
import { setToasts } from '@shared/manager/ui';
import { setErrorHook, setTokenGetter } from '@shared/manager/request';
import { navToLoginPage } from './utils/request';
import { getPortalJWT } from './utils/auth';
import {
  initAnalytics,
  setAnalyticsUser,
  trackEvent,
} from '@web/utils/analytics-helper';
import { setStorage } from '@shared/manager/storage';
import rnStorage from '@shared/api/rn-storage.api';
import { setAnalytics } from '@shared/manager/analytics';

initAnalytics();

setToasts((msg, type = 'info') => {
  message.open({
    type,
    duration: 3,
    content: msg,
  });
});

setErrorHook((err) => {
  if (err.response && err.response.status === 401) {
    const responseURL = err.request.responseURL;
    const pathname = window.location.pathname; // 获取url路径，不包含querystring

    if (
      !(
        pathname.includes('/sso/login') ||
        responseURL.includes('/player/sso/check')
      )
    ) {
      // 若当前页不是登录页, 也不是检查页面。则进行页面跳转
      console.log('未登录: 正在跳转到登录页面...');
      navToLoginPage();
      return false;
    }
  }

  return true;
});

setTokenGetter(() => {
  // portal 端使用简单的jwt作为沟通方式
  // 因为跨webview写入比较麻烦
  return Promise.resolve(getPortalJWT());
});

setStorage(() => rnStorage);

setAnalytics(() => ({ setAnalyticsUser, trackEvent }));
