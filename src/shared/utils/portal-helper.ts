import * as trpgApi from '@shared/api/trpg.api';
import _isNil from 'lodash/isNil';
import rnStorage from '@shared/api/rn-storage.api';
const api = trpgApi.getInstance();

/**
 * 获取用户的JWT
 * 签证过期时间为1天
 * TODO: 需要一个检测机制检测是否过期，如果过期的话需要重新获取
 * @param userUUID 当前用户UUID
 */
export const getWebToken = async (userUUID: string): Promise<string | null> => {
  if (_isNil(userUUID)) {
    return null;
  }
  const cachedKey = `sso:jwt:${userUUID}`;

  let jwt: string = await rnStorage.get(cachedKey);
  if (!jwt) {
    try {
      const res = await api.emitP('player::getWebToken');
      jwt = res.jwt;
      await rnStorage.set(cachedKey, jwt);
    } catch (e) {
      console.log('[getWebToken]', e);
    }
  }

  return jwt;
};
