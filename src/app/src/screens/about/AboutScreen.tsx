import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { List, WhiteSpace } from '@ant-design/react-native';
import { View } from 'react-native';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import appConfig from '@app/config.app';
import config from '@shared/project.config';
import { useTRPGNavigation } from '@app/hooks/useTRPGNavigation';

const Item = List.Item;

export const AboutScreen: React.FC = TMemo(() => {
  const dispatch = useTRPGDispatch();
  const { navigation, openWebview } = useTRPGNavigation();

  return (
    <View>
      <List>
        <Item
          arrow="horizontal"
          onPress={() => openWebview(config.url.homepage)}
        >
          官网
        </Item>
        <Item arrow="horizontal" onPress={() => openWebview(config.url.blog)}>
          开发博客
        </Item>
      </List>

      <WhiteSpace size="md" />

      <List>
        <Item
          arrow="horizontal"
          extra={appConfig.version}
          onPress={() => navigation.navigate('Version')}
        >
          当前版本
        </Item>
      </List>
    </View>
  );
});
AboutScreen.displayName = 'AboutScreen';
