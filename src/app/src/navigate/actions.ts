import { CommonActions } from '@react-navigation/native';

export function resetScreenAction(routeName: string, params?: object) {
  return CommonActions.reset({
    index: 0,
    routes: [
      {
        name: routeName,
        params,
      },
    ],
  });
}
