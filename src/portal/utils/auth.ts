// 从内存中读取token而不是磁盘以增加读取效率
// https://www.jianshu.com/p/0a3399c0d5e2
import _isUndefined from 'lodash/isUndefined';

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
