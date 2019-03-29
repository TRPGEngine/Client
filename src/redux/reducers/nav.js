import { NavigationActions, StackActions } from 'react-navigation';
import { AppNavigator } from '../../app/router';
const {
  LOGIN_SUCCESS,
  LOGIN_TOKEN_SUCCESS,
  LOGOUT,
  SWITCH_NAV,
  REPLACE_NAV,
  BACK_NAV,
} = require('../constants');

let initialNavState = AppNavigator.router.getStateForAction(
  NavigationActions.init()
);
console.log(NavigationActions);

module.exports = function nav(state = initialNavState, action) {
  let nextState;
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
    case SWITCH_NAV:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({
          routeName: action.routeName,
          params: action.params || {},
        }),
        state
      );
      break;
    case REPLACE_NAV:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: action.routeName }),
          ],
        }),
        state
      );
      break;
    case BACK_NAV:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back({ key: action.key || null }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};
