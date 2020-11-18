import _isObject from 'lodash/isObject';
import _get from 'lodash/get';
import _isNull from 'lodash/isNull';
import _isNil from 'lodash/isNil';
import rnStorage from '@shared/api/rn-storage.api';
import jwtDecode from 'jwt-decode';

/**
 * 获取完整jwt字符串的载荷信息(尝试解析json)
 * @param jwt 完整的jwt字符串
 */
export function getJWTPayload(jwt: string) {
  try {
    const decoded = jwtDecode(jwt);
    return decoded;
  } catch (e) {
    console.error(`getJWTInfo Error: [jwt: ${jwt}]`, e);
  }

  return {};
}

// JWT的内存缓存
let _userJWT: string | null = null;

/**
 * 设置用户登录标识
 */
export async function setUserJWT(jwt: string): Promise<void> {
  _userJWT = jwt; // 更新内存中的缓存
  await rnStorage.set('jsonwebtoken', jwt);
}

/**
 * 获取用户登录标识
 */
export async function getUserJWT(): Promise<string> {
  if (_isNull(_userJWT)) {
    const jwt = await rnStorage.get('jsonwebtoken');
    _userJWT = jwt; // 将其缓存到内存中

    return jwt;
  }
  return _userJWT;
}

interface JWTUserInfoData {
  name?: string;
  uuid?: string;
  avatar?: string;
}
/**
 * 获取token中的明文信息
 * 明确需要返回一个对象
 */
export async function getJWTUserInfo(): Promise<JWTUserInfoData> {
  try {
    const token = await getUserJWT();
    const info = getJWTPayload(token);
    if (_isObject(info)) {
      return info;
    }
  } catch (e) {
    console.error('getJWTInfo Error:', e);
  }

  return {};
}
