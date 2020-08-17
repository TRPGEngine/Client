import _get from 'lodash/get';
import history from '../history';
import { createRequest } from '@shared/utils/request';

/**
 * 跳转到登录页面
 */
export function navToLoginPage() {
  const pathname = window.location.pathname;
  if (pathname.includes('/sso/login')) {
    // 如果已在登录页，则不再跳转
    return;
  }

  const next = encodeURIComponent(pathname);
  history.push(`/sso/login?next=${next}`);
}

export const request = createRequest({
  errorHook: (err) => {
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
  },
});
