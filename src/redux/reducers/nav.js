import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../../app/router';
const {
  LOGIN_SUCCESS,
  LOGOUT,
  SWITCH_NAV,
  REPLACE_NAV,
} = require('../constants');

let initialNavState = AppNavigator.router.getStateForAction(NavigationActions.init());

module.exports = function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case LOGIN_SUCCESS:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: 'Main'}),
          ]
        }),
        state
      );
      break;
    case LOGOUT:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: 'Login'}),
          ]
        }),
        state
      );
      break;
    case SWITCH_NAV:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({routeName: action.routeName }),
        state
      );
      break;
    case REPLACE_NAV:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: action.routeName}),
          ]
        }),
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
