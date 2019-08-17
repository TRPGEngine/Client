import React from 'react';
import { View, Text, Clipboard } from 'react-native';
import { umPush } from '@app/native/push-utils';
import { TButton } from '@src/app/components/TComponent';
import { Toast, WingBlank } from '@ant-design/react-native';

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

  handleCopyRegistrationId = () => {
    umPush.getRegistrationId((registrationId) => {
      Clipboard.setString(registrationId);
      Toast.success('复制成功');
    });
  };

  render() {
    return (
      <WingBlank size="md">
        <Text>{this.state.appInfoStr}</Text>
        <TButton onPress={this.handleCopyRegistrationId}>复制到剪切板</TButton>
      </WingBlank>
    );
  }
}

export default DeviceInfoScreen;
