import { getGlobalNavigation } from '@app/navigate/global';
import _isNil from 'lodash/isNil';
import { TRPGMiddleware } from '@redux/types/__all__';
import constants from '@shared/redux/constants';
import { resetScreenAction } from '@app/navigate/actions';
const {
  LOGIN_SUCCESS,
  LOGIN_TOKEN_SUCCESS,
  LOGOUT,
  CREATE_GROUP_SUCCESS,
} = constants;

/**
 * 一个自动导航器用于监听redux的变更
 */
export const appNavMiddleware: TRPGMiddleware = ({ dispatch, getState }) => (
  next
) => (action) => {
  const globalNavigation = getGlobalNavigation();

  if (!_isNil(globalNavigation)) {
    const rootState = globalNavigation.getRootState();
    switch (action.type) {
      case LOGIN_SUCCESS:
      case LOGIN_TOKEN_SUCCESS:
        if (rootState.index > 0 && rootState.routes[0].name !== 'Main') {
          globalNavigation.dispatch(resetScreenAction('Main'));
        }

        break;
      case LOGOUT:
        if (rootState.index > 0 && rootState.routes[0].name !== 'Login') {
          globalNavigation.dispatch(resetScreenAction('Login'));
        }
        break;
      case CREATE_GROUP_SUCCESS:
        if (globalNavigation.canGoBack()) {
          globalNavigation.goBack();
        }
        break;
      default:
        break;
    }
  }

  next(action);
};
