// 从内存中读取token而不是磁盘以增加读取效率
// https://www.jianshu.com/p/0a3399c0d5e2
import _isUndefined from 'lodash/isUndefined';
import _get from 'lodash/get';
import _isString from 'lodash/isString';
import _isObject from 'lodash/isObject';
import { request, navToLoginPage } from './request';
import { getJWTPayload } from '@shared/utils/jwt-helper';

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
 * 该检查一般用于表单填写页面防止填了一堆数据后提交失败跳转到登录页的挫败感
 */
export const checkToken = async (autoNav = true): Promise<void> => {
  try {
    await request.post('/player/sso/check');
  } catch (err) {
    if (autoNav) {
      // 如果出错则跳转到登录页面
      navToLoginPage();
    }
    throw err;
  }
};

interface UserInfo {
  name?: string;
  uuid?: string;
  avatar?: string;
}
/**
 * 获取token中的明文信息
 * 明确需要返回一个对象
 */
export const getJWTInfo = (): UserInfo => {
  try {
    if (_isString(token)) {
      const info = getJWTPayload(token);
      if (_isObject(info)) {
        return info;
      }
    }
  } catch (e) {
    console.error('getJWTInfo Error:', e);
  }

  return {};
};
