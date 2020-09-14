import { request } from '@shared/utils/request';
import md5 from 'md5';
import { setUserJWT } from '@shared/utils/jwt-helper';
import { CachePolicy, buildCacheFactory } from '@shared/utils/cache-factory';

export interface PlayerUser {
  id: number;
  name?: string;
  uuid: string;
  username: string;
  nickname: string;
  avatar: string;
  last_login: string;
  last_ip: string;
  sex: string;
  sign: string;
  alignment: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PlayerUserLoginLogType {
  user_uuid: string;
  user_name: string;
  type: 'standard' | 'token' | 'app_standard' | 'app_token';
  channel: string;
  socket_id: string;
  ip: string;
  ip_address: string;
  platform: string;
  device_info: object;
  is_success: boolean;
  offline_date: string;
  createdAt: string;
}

/**
 * 使用用户名密码登录来获取jwt
 * @param username 用户名
 * @param password 密码
 */
export async function loginWithPassword(
  username: string,
  password: string
): Promise<string> {
  const { data } = await request.post('/player/sso/login', {
    username,
    password: md5(password),
  });

  const jwt = data.jwt;
  await setUserJWT(jwt);

  return jwt;
}

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
 * 获取用户登录记录
 */
export const fetchUserPrivateLoginLog = buildCacheFactory<
  PlayerUserLoginLogType[]
>(CachePolicy.Temporary, async () => {
  const { data } = await request.get(`/player/login/history/private`);
  return data.logs ?? [];
});
