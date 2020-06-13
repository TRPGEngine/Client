import _isObject from 'lodash/isObject';
import _get from 'lodash/get';

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
