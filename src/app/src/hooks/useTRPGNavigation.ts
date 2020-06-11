import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

export function useTRPGNavigation() {
  const navigation = useNavigation();
  const openWebview = useCallback(
    (url) => {
      navigation.navigate('Webview', {
        url,
      });
    },
    [navigation]
  );

  return { navigation, openWebview };
}
