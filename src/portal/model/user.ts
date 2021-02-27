import { setPortalJWT } from '@portal/utils/auth';
import { loginWithPassword } from '@shared/model/player';
import { trackEvent } from '@web/utils/analytics-helper';

/**
 * portal端登录
 * @param username 用户名
 * @param password 密码
 */
export async function loginPortalWithPassword(
  username: string,
  password: string
) {
  trackEvent('player:login', {
    username,
    platform: 'portal',
  });
  const { jwt } = await loginWithPassword(username, password);

  setPortalJWT(jwt);
}
