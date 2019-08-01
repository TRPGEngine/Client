import React from 'react';
import { View, Text } from 'react-native';
import { umPush } from '@app/native/push-utils';

class DeviceInfoScreen extends React.Component {
  state = {
    appInfoStr: '',
  };

  componentDidMount() {
    umPush.appInfo((result) => {
      this.setState({
        appInfoStr: result,
      });
    });
  }

  render() {
    return (
      <View>
        <Text>{this.state.appInfoStr}</Text>
      </View>
    );
  }
}

export default DeviceInfoScreen;
