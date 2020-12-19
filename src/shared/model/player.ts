import { request } from '@shared/utils/request';
import md5 from 'md5';
import { setUserJWT } from '@shared/utils/jwt-helper';
import {
  CachePolicy,
  buildCacheFactory,
  buildCacheHashFnPrefix,
} from '@shared/utils/cache-factory';

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
  qq_number: string;
  token?: string;
  app_token?: string;
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

// 阵营九宫格
export type UserAlignment =
  | 'LG'
  | 'NG'
  | 'CG'
  | 'LN'
  | 'TN'
  | 'CN'
  | 'LE'
  | 'NE'
  | 'CE';

export type UserGender = '男' | '女' | '其他' | '保密';

/**
 * 使用用户名密码登录来获取jwt
 * @param username 用户名
 * @param password 密码
 */
export async function loginWithPassword(
  username: string,
  password: string
): Promise<{
  jwt: string;
  info: PlayerUser;
}> {
  const { data } = await request.post('/player/sso/login', {
    username,
    password: md5(password),
  });

  const { jwt, info } = data;
  await setUserJWT(jwt);

  return { jwt, info };
}

/**
 * 获取用户信息
 */
export const fetchUserInfo = buildCacheFactory<PlayerUser>(
  CachePolicy.Persistent,
  (uuid: string) => {
    return request.get(`/player/info/${uuid}`).then(({ data }) => data.user);
  },
  buildCacheHashFnPrefix('fetchUserInfo')
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
