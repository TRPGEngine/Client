import _isFunction from 'lodash/isFunction';

/**
 * 用户状态管理
 * 监听用户状态变更
 * 可以方便在插件中注入对用户逻辑的监听
 *
 * 如果已经处于要注入的状态, 则可以立即执行
 */

type UserStatus = 'login' | 'logout' | 'none';
type UserStatusChangedFn = () => void;

let userState: UserStatus = 'none';

const userLoginSuccessCallbackList: UserStatusChangedFn[] = [];
/**
 * 订阅事件到用户登录成功
 */
export function subscribeToUserLoginSuccess(cb: UserStatusChangedFn) {
  if (userState === 'login') {
    // 如果已经登录则立即执行
    _isFunction(cb) && cb();
  }

  userLoginSuccessCallbackList.push(cb);
}
export function callUserLoginSuccess() {
  userState = 'login';

  userLoginSuccessCallbackList.forEach((cb) => {
    _isFunction(cb) && cb();
  });
}

const userLogoutSuccessCallbackList: UserStatusChangedFn[] = [];
/**
 * 订阅事件到用户登出
 */
export function subscribeToUserLogoutSuccess(cb: UserStatusChangedFn) {
  if (userState === 'logout') {
    // 如果已经登出则立即执行
    _isFunction(cb) && cb();
  }

  userLogoutSuccessCallbackList.push(cb);
}
export function callUserLogoutSuccess() {
  userState = 'logout';

  userLogoutSuccessCallbackList.forEach((cb) => {
    _isFunction(cb) && cb();
  });
}
