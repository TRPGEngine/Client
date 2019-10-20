import React from 'react';
import { View, Text, NativeModules } from 'react-native';
import Config from 'react-native-config';

import { TButton } from '@app/components/TComponent';
import styled from 'styled-components/native';
import { sendBasicNotify, clearAllNotifications } from '@app/native/trpg';

import MessageHandler from '@app/components/messageTypes/__all__';
import { switchNav, navPortal } from '@app/redux/actions/nav';
import config from '@src/shared/project.config';
import { connect, DispatchProp } from 'react-redux';

const TRPGModule = NativeModules.TRPGModule;

const DevButton = styled(TButton)`
  margin: 10px;
`;

interface Props extends DispatchProp {}
class DevelopLabScreen extends React.Component<Props> {
  sendBasicNotify = () => {
    sendBasicNotify({ title: 'test', message: 'message' });
  };

  handleEnvConfig = () => {
    alert(JSON.stringify(Config, null, 4));
  };

  render() {
    const { dispatch } = this.props;

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
        <DevButton onPress={this.handleEnvConfig}>Print Env Config</DevButton>
        <DevButton onPress={() => dispatch(navPortal('/sso/login'))}>
          打开Portal登录
        </DevButton>

        <MessageHandler
          type="loading"
          me={true}
          name="test"
          avatar={null}
          info={{ message: 'test', type: 'loading', data: { progress: 0.5 } }}
          emphasizeTime={false}
        />
      </View>
    );
  }
}

export default connect()(DevelopLabScreen);
