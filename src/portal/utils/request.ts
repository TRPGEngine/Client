import axios from 'axios';
import config from '@src/shared/project.config';
import _get from 'lodash/get';
import history from '../history';
import { getToken } from './auth';

export const request = axios.create({
  baseURL: config.url.api,
});

request.interceptors.request.use((val) => {
  if (
    ['post', 'get'].includes(val.method.toLowerCase()) &&
    !val.headers['X-Token']
  ) {
    // 任何请求都尝试增加token
    val.headers['X-Token'] = getToken();
  }

  return val;
});

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

request.interceptors.response.use(
  (val) => val,
  (err) => {
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
        return;
      }
    }

    // 尝试获取msg
    throw _get(err, 'response.data.msg', err);
  }
);
