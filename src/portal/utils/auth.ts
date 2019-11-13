// 从内存中读取token而不是磁盘以增加读取效率
// https://www.jianshu.com/p/0a3399c0d5e2
import _isUndefined from 'lodash/isUndefined';
import { request } from './request';

let token: string;
export const saveToken = (jwt: string): void => {
  window.localStorage.setItem('jwt', jwt);
  token = jwt; // 更新内存中的数据
};

export const getToken = (): string => {
  if (_isUndefined(token)) {
    token = window.localStorage.getItem('jwt');
  }
  return token;
};

/**
 * 发送一个校验token的请求到服务端
 * 如果校验不通过会由request的拦截器自动跳转到登录页
 */
export const checkToken = (): Promise<void> => {
  return request.post('/player/sso/check');
};
