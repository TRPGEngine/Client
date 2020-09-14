import _isObject from 'lodash/isObject';
import _get from 'lodash/get';
import _isNull from 'lodash/isNull';
import _isNil from 'lodash/isNil';
import rnStorage from '@shared/api/rn-storage.api';

/**
 * 获取完整jwt字符串的载荷信息(尝试解析json)
 * @param jwt 完整的jwt字符串
 */
export function getJWTPayload(jwt: string) {
  try {
    const infoSection = _get(jwt.split('.'), '1', '');
    const json = base64URLDecode(infoSection);
    const info = JSON.parse(json);
    return info;
  } catch (e) {
    console.error('getJWTInfo Error:', e);
  }

  return {};
}

// 解析方式来自于 http://jwt.calebb.net/
function base64URLDecode(base64UrlEncodedValue: string) {
  const newValue = base64UrlEncodedValue.replace('-', '+').replace('_', '/');

  try {
    return decodeURIComponent(escape(window.atob(newValue)));
  } catch (e) {
    throw new Error('Base64URL decode of JWT segment failed');
  }
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
