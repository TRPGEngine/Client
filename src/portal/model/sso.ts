import md5 from 'md5';
import { request } from '@portal/utils/request';
import { saveToken } from '@portal/utils/auth';
import _isString from 'lodash/isString';

/**
 * 使用用户名密码登录
 * @param username 用户名
 * @param password 密码
 */
export const loginWithPassword = (username: string, password: string) => {
  return request
    .post('/player/sso/login', {
      username,
      password: md5(password),
    })
    .then(({ data }) => {
      if (data.result === true) {
        saveToken(data.jwt);
      } else {
        throw new Error(data.msg);
      }
    });
};
