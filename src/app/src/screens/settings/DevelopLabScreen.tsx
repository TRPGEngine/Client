import React from 'react';
import { ScrollView, Text, NativeModules } from 'react-native';
import Config from 'react-native-config';
import RootSibling from 'react-native-root-siblings';

import { TButton } from '@app/components/TComponent';
import styled from 'styled-components/native';
import { sendBasicNotify, clearAllNotifications } from '@app/native/trpg';

import MessageHandler from '@app/components/messageTypes/__all__';
import { switchNav, navPortal } from '@app/redux/actions/nav';
import config from '@src/shared/project.config';
import { connect } from 'react-redux';
import { TRPGDispatchProp, TRPGState } from '@src/shared/redux/types/__all__';
import rnStorage from '@shared/api/rn-storage.api';
import SuspensionWindow from '@app/components/SuspensionWindow';

const TRPGModule = NativeModules.TRPGModule;

const DevButton = styled(TButton)`
  margin: 10px;
`;

interface Props extends TRPGDispatchProp {
  userUUID: string;
}
class DevelopLabScreen extends React.Component<Props> {
  sendBasicNotify = () => {
    sendBasicNotify({ title: 'test', message: 'message' });
  };

  handleEnvConfig = () => {
    alert(JSON.stringify(Config, null, 4));
  };

  handlePortalLogin = () => {
    this.props.dispatch(navPortal('/sso/login'));
  };

  sibling: RootSibling;
  handleOpenSuspensionWindow = () => {
    if (this.sibling) {
      return;
    }
    this.sibling = new RootSibling(
      (
        <SuspensionWindow close={this.handleCloseSuspensionWindow} toFloat>
          <Text>test data</Text>
        </SuspensionWindow>
      )
    );
  };

  handleCloseSuspensionWindow = () => {
    this.sibling && this.sibling.destroy();
    this.sibling = undefined;
  };

  render() {
    const { userUUID } = this.props;
    return (
      <ScrollView>
        <Text style={{ textAlign: 'center' }}>开发实验室</Text>
        <Text>当前用户: {userUUID}</Text>
        <DevButton onPress={() => TRPGModule.show('Awesome', TRPGModule.SHORT)}>
          原生Toast
        </DevButton>
        <DevButton onPress={this.sendBasicNotify}>发送本地通知</DevButton>
        <DevButton onPress={() => clearAllNotifications()}>
          清理应用通知
        </DevButton>
        <DevButton onPress={this.handleEnvConfig}>Print Env Config</DevButton>
        <DevButton onPress={this.handlePortalLogin}>打开Portal登录</DevButton>
        <DevButton
          onPress={() =>
            rnStorage
              .remove(`sso:jwt:${userUUID}`)
              .then(() => alert('清理完毕'))
          }
        >
          清理当前用户单点登录token
        </DevButton>
        <DevButton onPress={this.handleOpenSuspensionWindow}>
          打开悬浮窗
        </DevButton>

        <MessageHandler
          type="loading"
          me={true}
          name="test"
          avatar={null}
          info={{ message: 'test', type: 'loading', data: { progress: 0.5 } }}
          emphasizeTime={false}
        />
        <MessageHandler
          type="normal"
          me={true}
          name="test"
          avatar={null}
          info={{ message: 'http://www.baidu.com/', type: 'normal' }}
          emphasizeTime={false}
        />
      </ScrollView>
    );
  }
}

export default connect((state: TRPGState) => ({
  userUUID: state.user.info.uuid ?? '',
}))(DevelopLabScreen);
