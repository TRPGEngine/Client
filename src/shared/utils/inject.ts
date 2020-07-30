// 该文件用于在一些通用逻辑内注射一些各个平台特有代码来实现部分逻辑区分的目的

/**
 * TODO: 这些操作应当使用 shared/redux/middlewares/watchLoginStatus.tsx 来实现
 */
import _isFunction from 'lodash/isFunction';

let _loginSuccessCallback: any = null;
export function injectLoginSuccessCallback(callback: () => void) {
  _loginSuccessCallback = callback;
}
export function runLoginSuccessCallback() {
  _isFunction(_loginSuccessCallback) && _loginSuccessCallback();
}

let _logoutSuccessCallback: any = null;
export function injectLogoutSuccessCallback(callback: () => void) {
  _logoutSuccessCallback = callback;
}
export function runLogoutSuccessCallback() {
  _isFunction(_logoutSuccessCallback) && _loginSuccessCallback();
}
