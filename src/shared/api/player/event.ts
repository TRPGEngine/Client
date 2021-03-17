import * as trpgApi from '../trpg.api';
const api = trpgApi.getInstance();

/**
 * 检查用户登录状态
 */
export async function checkAuthStatus(): Promise<boolean> {
  const { isAuth = false } = await api.emitP<{
    isAuth: boolean;
  }>('player::checkAuthStatus');

  return isAuth;
}
