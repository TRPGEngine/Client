import React, { useCallback } from 'react';
import { NavigationScreenComponent, NavigationActions } from 'react-navigation';
import { TMemo } from '@shared/components/TMemo';
import { List } from '@ant-design/react-native';
import { View } from 'react-native';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import appConfig from '@app/config.app';
import { openWebview } from '@app/redux/actions/nav';
import config from '@shared/project.config';

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
          onPress={() => {
            dispatch(openWebview(config.url.homepage));
          }}
        >
          官网
        </Item>
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
