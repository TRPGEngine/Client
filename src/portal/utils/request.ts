import _get from 'lodash/get';
import history from '../history';

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

export { request } from '@shared/utils/request';
