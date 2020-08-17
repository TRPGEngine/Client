import { request } from '@shared/utils/request';
import md5 from 'md5';
import { setUserJWT } from '@shared/utils/jwt-helper';

/**
 * 使用用户名密码登录来获取jwt
 * @param username 用户名
 * @param password 密码
 */
export async function loginWithPassword(
  username: string,
  password: string
): Promise<void> {
  const { data } = await request.post('/player/sso/login', {
    username,
    password: md5(password),
  });

  await setUserJWT(data.jwt);
}
