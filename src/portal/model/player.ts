import { buildCacheFactory, CachePolicy } from '@shared/utils/cache-factory';
import { request } from '@portal/utils/request';
import md5 from 'md5';
import { PlayerUser } from '@shared/model/player';

/**
 * 获取用户信息
 */
export const fetchUserInfo = buildCacheFactory<PlayerUser>(
  CachePolicy.Persistent,
  (uuid: string) => {
    return request.get(`/player/info/${uuid}`).then(({ data }) => data.user);
  }
);

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
