import React from 'react';
import { View, Text } from 'react-native';
import {
  NavigationScreenProps,
  NavigationScreenConfig,
  NavigationScreenOptions,
} from 'react-navigation';

interface Props
  extends NavigationScreenProps<{
    uuids: string[];
    onSelected: (selectedUUID: string[]) => void;
    title?: string;
  }> {}

class UserSelectScreen extends React.Component<Props> {
  static navigationOptions: NavigationScreenConfig<NavigationScreenOptions> = (
    props: Partial<Props>
  ) => ({
    title: props.navigation.getParam('title', undefined),
  });

  get uuids() {
    return this.props.navigation.getParam('uuids', []);
  }

  render() {
    return (
      <View>
        <Text>选择用户, {JSON.stringify(this.uuids)}</Text>
      </View>
    );
  }
}

export default UserSelectScreen;
