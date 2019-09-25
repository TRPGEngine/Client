import React from 'react';
import { View, Text, NativeModules } from 'react-native';

import { TButton } from '../../components/TComponent';
import styled from 'styled-components/native';
import { sendBasicNotify, clearAllNotifications } from '../../native/trpg';

const TRPGModule = NativeModules.TRPGModule;

const DevButton = styled(TButton)`
  margin: 10px;
`;

class DevelopLabScreen extends React.Component {
  sendBasicNotify = () => {
    sendBasicNotify({ title: 'test', message: 'message' });
  };

  render() {
    return (
      <View>
        <Text style={{ textAlign: 'center' }}>开发实验室</Text>
        <DevButton onPress={() => TRPGModule.show('Awesome', TRPGModule.SHORT)}>
          原生Toast
        </DevButton>
        <DevButton onPress={this.sendBasicNotify}>发送本地通知</DevButton>
        <DevButton onPress={() => clearAllNotifications()}>
          清理应用通知
        </DevButton>
      </View>
    );
  }
}

export default DevelopLabScreen;
