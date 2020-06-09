import { NavigationActions, StackActions } from 'react-navigation';
import { AppNavigator } from '../../router';
import constants from '@shared/redux/constants';
const {
  LOGIN_SUCCESS,
  LOGIN_TOKEN_SUCCESS,
  LOGOUT,
  CREATE_GROUP_SUCCESS,
} = constants;

let initialNavState = AppNavigator.router.getStateForAction(
  NavigationActions.init()
);

export default function nav(state = initialNavState, action) {
  let nextState;

  // TODO: 待处理
  switch (action.type) {
    case LOGIN_SUCCESS:
    case LOGIN_TOKEN_SUCCESS:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Main' })],
        }),
        state
      );
      break;
    case LOGOUT:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Login' })],
        }),
        state
      );
      break;
    case CREATE_GROUP_SUCCESS:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.popToTop({}),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}
