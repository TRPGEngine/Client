import { request } from '@portal/utils/request';
import md5 from 'md5';

/**
 * 注册账号
 * @param username 用户名
 * @param password 密码
 */
export const registerAccount = (username: string, password: string) => {
  return request.post('/player/register', {
    username,
    password: md5(password),
  });
};
