import { NavigationActions } from 'react-navigation';
import { AppNavigator, MainNavigator } from '../../app/router';
const {
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

console.log(initialNavState);
module.exports = function nav(state = initialNavState, action) {
  let nextState;
  console.log(action, state);
  switch (action.type) {
    // case 'Login':
    //   nextState = AppNavigator.router.getStateForAction(
    //     NavigationActions.back(),
    //     state
    //   );
    //   break;
    // case 'Logout':
    //   nextState = AppNavigator.router.getStateForAction(
    //     NavigationActions.navigate({ routeName: 'Login' }),
    //     state
    //   );
    //   break;
    case SWITCH_NAV:
      console.log(NavigationActions.navigate({ routeName: action.routeName }));
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.routeName }),
        state
      );
      console.log(nextState);
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  console.log('nextState', nextState);

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}
