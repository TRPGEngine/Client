import { message } from 'antd';
import { setToasts } from '@shared/manager/ui';
import { setErrorHook } from '@shared/manager/request';
import { navToLoginPage } from './utils/request';

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
