import type { TRPGMiddleware } from '@redux/types/__all__';
import constants from '../constants/index';
import type { UserInfo } from '@redux/types/user';
const { LOGIN_SUCCESS, LOGIN_TOKEN_SUCCESS, LOGIN_FAILED } = constants;

/**
 * 监听登录状态的变更
 * 将其登录结果发送到回调
 */

interface LoginStatusCallback {
  onLoginSuccess?: (info: UserInfo) => void;
  onLoginFailed?: () => void;
}
export const watchLoginStatus = (cb: LoginStatusCallback): TRPGMiddleware => ({
  dispatch,
  getState,
}) => (next) => (action) => {
  if (action.type === LOGIN_SUCCESS || action.type === LOGIN_TOKEN_SUCCESS) {
    cb.onLoginSuccess?.(action.payload);
  }

  if (action.type === LOGIN_FAILED) {
    cb.onLoginFailed?.();
  }

  next(action);
};
