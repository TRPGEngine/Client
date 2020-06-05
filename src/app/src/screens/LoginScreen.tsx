import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import sb from 'react-native-style-block';
import { login } from '../../../shared/redux/actions/user';
import { openWebview } from '../redux/actions/nav';
import config from '../../../shared/project.config';
import appConfig from '../config.app';
import {
  TButton,
  TFormGroup,
  TLoading,
} from '@src/app/src/components/TComponent';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import _isEmpty from 'lodash/isEmpty';
import styled from 'styled-components/native';

const LoginTitle = styled.Text`
  text-align: left;
  font-size: 20px;
  padding-left: 10px;
  margin-bottom: 20px;
`;

const RegisterText = styled.Text`
  color: #2f9bd7;
  text-align: right;
  font-size: 14px;
`;

const OAuthTipText = styled.Text`
  text-align: center;
  font-size: 12px;
`;

interface Props extends TRPGDispatchProp {
  oauthList: string[];
}
class LoginScreen extends React.Component<Props> {
  state = {
    username: '',
    password: '',
  };

  handleLogin() {
    let { username, password } = this.state;
    if (!!username && !!password) {
      this.props.dispatch(login(this.state.username, this.state.password));
    }
  }

  handleQQLogin() {
    this.props.dispatch(
      openWebview(config.file.url + '/oauth/qq/login?platform=app')
    );
  }

  renderOAuth() {
    const { oauthList } = this.props;
    if (_isEmpty(oauthList)) {
      return;
    }

    return (
      <View style={styles.oauth}>
        <OAuthTipText>第三方登录</OAuthTipText>
        <View style={styles.oauthBtnContainer}>
          {oauthList.includes('qq') ? (
            <TouchableOpacity onPress={() => this.handleQQLogin()}>
              <Image
                style={styles.oauthBtnImage}
                source={appConfig.oauth.qq.icon}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TLoading />
        <LoginTitle>欢迎来到TRPG Game</LoginTitle>
        <TFormGroup
          label="用户名"
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })}
          input={{
            placeholder: '请输入用户名',
          }}
        />
        <TFormGroup
          label="密码"
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
          input={{
            placeholder: '请输入密码',
            secureTextEntry: true,
          }}
        />
        <TButton onPress={() => this.handleLogin()}>登录</TButton>
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() =>
            this.props.dispatch(
              NavigationActions.navigate({ routeName: 'Register' })
            )
          }
        >
          <RegisterText>没有账户？点击此处注册</RegisterText>
        </TouchableOpacity>

        {this.renderOAuth()}
      </View>
    );
  }
}

const styles = {
  container: [
    // sb.alignCenter(),
    sb.flex(),
    sb.padding(80, 20, 0),
  ],
  registerBtn: [sb.bgColor('transparent'), { marginTop: 10, height: 32 }],
  oauth: [{ justifyContent: 'flex-end' }, sb.flex(), sb.padding(0, 0, 10, 0)],
  oauthBtnContainer: [sb.alignCenter(), sb.margin(10, 0)],
  oauthBtnImage: [sb.size(40, 40), sb.radius(20)],
};

export default connect((state: TRPGState) => ({
  oauthList: state.settings.config.oauth ?? [],
}))(LoginScreen);
