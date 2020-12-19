import rnStorage from '@shared/api/rn-storage.api';

/**
 * 存储用户登录授权
 */
export function saveUserToken(uuid: string, token: string, isApp = false) {
  if (isApp) {
    // 如果是app的话，则永久储存
    rnStorage.save('uuid', uuid);
    rnStorage.save('token', token);
  } else {
    // 7天后自动过期
    const expires = 1000 * 3600 * 24 * 7;
    rnStorage.setWithExpires('uuid', uuid, expires);
    rnStorage.setWithExpires('token', token, expires);
  }
}
