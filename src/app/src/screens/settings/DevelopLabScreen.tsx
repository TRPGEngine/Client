import React from 'react';
import { View, Text, NativeModules } from 'react-native';

import { TButton } from '../../components/TComponent';
import styled from 'styled-components/native';

const TRPGModule = NativeModules.TRPGModule;

const DevButton = styled(TButton)`
  margin: 10px;
`;

class DevelopLabScreen extends React.Component {
  sendBasicNotify = () => {
    TRPGModule.sendBasicNotify({ title: 'test', message: 'message' });
  };

  render() {
    return (
      <View>
        <Text style={{ textAlign: 'center' }}>开发实验室</Text>
        <DevButton onPress={() => TRPGModule.show('Awesome', TRPGModule.SHORT)}>
          原生Toast
        </DevButton>
        <DevButton onPress={this.sendBasicNotify}>发送本地通知</DevButton>
      </View>
    );
  }
}

export default DevelopLabScreen;
