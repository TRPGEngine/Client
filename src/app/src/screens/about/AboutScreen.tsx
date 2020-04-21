import React, { useCallback } from 'react';
import { NavigationScreenComponent, NavigationActions } from 'react-navigation';
import { TMemo } from '@shared/components/TMemo';
import { List } from '@ant-design/react-native';
import { View } from 'react-native';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import appConfig from '@app/config.app';

const Item = List.Item;

export const AboutScreen: NavigationScreenComponent = TMemo(() => {
  const dispatch = useTRPGDispatch();
  const handleNav = useCallback(
    (routeName: string) => {
      dispatch(NavigationActions.navigate({ routeName }));
    },
    [dispatch]
  );

  return (
    <View>
      <List>
        <Item
          arrow="horizontal"
          extra={appConfig.version}
          onPress={() => {
            handleNav('Version');
          }}
        >
          当前版本
        </Item>
      </List>
    </View>
  );
});
AboutScreen.displayName = 'AboutScreen';
