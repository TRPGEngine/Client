// 该文件用于在一些通用逻辑内注射一些各个平台特有代码来实现部分逻辑区分的目的

let _loginSuccessCallback = null;
export function injectLoginSuccessCallback(callback) {
  _loginSuccessCallback = callback;
}
export function runLoginSuccessCallback() {
  _loginSuccessCallback && _loginSuccessCallback();
}
