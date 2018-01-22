import { NavigationActions } from 'react-navigation';
import { AppNavigator, MainNavigator } from '../../app/router';
const {
  LOGIN_SUCCESS,
  LOGOUT,
  SWITCH_NAV,
} = require('../constants');

//Force a Init of the main router
let initialNavState = AppNavigator.router.getStateForAction(NavigationActions.init());

// const firstAction = AppNavigator.router.getActionForPathAndParams("Details");
//
// //Then calculate the state with a navigate action to the first route, sending the previous initialized state as argument
// initialNavState = AppNavigator.router.getStateForAction(
//   firstAction,
//   initialNavState
// );

module.exports = function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case LOGIN_SUCCESS:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Main'})
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
            NavigationActions.navigate({ routeName: 'Login'})
          ]
        }),
        state
      );
      break;
    case SWITCH_NAV:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.routeName }),
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
