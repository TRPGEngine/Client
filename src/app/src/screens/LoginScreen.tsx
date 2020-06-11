import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import sb from 'react-native-style-block';
import { login } from '@shared/redux/actions/user';
import config from '@shared/project.config';
import appConfig from '../config.app';
import {
  TButton,
  TFormGroup,
  TLoading,
} from '@src/app/src/components/TComponent';
import _isEmpty from 'lodash/isEmpty';
import styled from 'styled-components/native';
import { StackScreenProps } from '@react-navigation/stack';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGDispatch,
  useTRPGSelector,
} from '@shared/hooks/useTRPGSelector';
import { useNavigation } from '@react-navigation/native';
import { TRPGStackParamList } from '@app/types/params';
import { openWebview } from '@app/navigate';
import { resetScreenAction } from '@app/navigate/actions';

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

interface Props extends StackScreenProps<TRPGStackParamList, 'Login'> {}
export const LoginScreen: React.FC<Props> = TMemo((props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const dispatch = useTRPGDispatch();
  const oauthList = useTRPGSelector<string[]>((state) => {
    const oauth = state.settings.config.oauth;
    if (Array.isArray(oauth)) {
      return oauth;
    } else {
      return [];
    }
  });

  const isLogin = useTRPGSelector((state) => state.user.isLogin);
  useEffect(() => {
    if (isLogin) {
      navigation.dispatch(resetScreenAction('Main'));
    }
  }, [isLogin, navigation]);

  const handleLogin = useCallback(() => {
    if (!!username && !!password) {
      dispatch(login(username, password));
    }
  }, [dispatch, username, password]);

  const handleQQLogin = useCallback(() => {
    openWebview(
      props.navigation,
      config.file.url + '/oauth/qq/login?platform=app'
    );
  }, [dispatch, props.navigation]);

  const OAuthNode = useMemo(() => {
    if (_isEmpty(oauthList)) {
      return;
    }

    return (
      <View style={styles.oauth}>
        <OAuthTipText>第三方登录</OAuthTipText>
        <View style={styles.oauthBtnContainer}>
          {oauthList.includes('qq') ? (
            <TouchableOpacity onPress={handleQQLogin}>
              <Image
                style={styles.oauthBtnImage}
                source={appConfig.oauth.qq.icon}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }, [oauthList, handleQQLogin]);

  return (
    <View style={styles.container}>
      <TLoading />
      <LoginTitle>欢迎来到TRPG Game</LoginTitle>
      <TFormGroup
        label="用户名"
        value={username}
        onChangeText={(username) => setUsername(username)}
        input={{
          placeholder: '请输入用户名',
        }}
      />
      <TFormGroup
        label="密码"
        value={password}
        onChangeText={(password) => setPassword(password)}
        input={{
          placeholder: '请输入密码',
          secureTextEntry: true,
        }}
      />
      <TButton onPress={handleLogin}>登录</TButton>
      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => navigation.navigate('Register')}
      >
        <RegisterText>没有账户？点击此处注册</RegisterText>
      </TouchableOpacity>

      {OAuthNode}
    </View>
  );
});

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

export default LoginScreen;
