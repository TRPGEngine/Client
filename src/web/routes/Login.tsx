import { login } from '@redux/actions/user';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGDispatch,
  useTRPGSelector,
} from '@shared/hooks/useTRPGSelector';
import { useTranslation } from '@shared/i18n';
import { showToasts } from '@shared/manager/ui';
import config from '@shared/project.config';
import { HiddenInMobile } from '@web/components/HiddenInMobile';
import { LanguageSwitchLink } from '@web/components/LanguageSwitchLink';
import { Logo } from '@web/components/Logo';
import Webview from '@web/components/Webview';
import { checkIsOldApp } from '@web/utils/debug-helper';
import { Button, Input, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useAsyncFn } from 'react-use';
import styled from 'styled-components';
import loginPatternUrl from '../assets/img/login-pattern.svg';

const Root = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const LoginContainer = styled(Space).attrs({
  direction: 'vertical',
  size: 12,
})`
  background-color: ${(props) => props.theme.color.graySet[7]};
  border-radius: 3px;
  height: 100vh;
  width: 568px;
  padding: 10vh 100px 0;
  background-image: url(${loginPatternUrl});
  background-repeat: repeat-y;
  position: relative;

  ${({ theme }) => theme.mixins.mobile('padding: 10vh 20px 0;')};

  .ant-input,
  .ant-input-password {
    background-color: ${(props) => props.theme.color.graySet[7]};
  }
`;

const LoginFooter = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;

  > .home-page {
    position: absolute;
    right: 0;
    bottom: 0;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  background-color: white;
`;

export const Login: React.FC = TMemo(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();
  const history = useHistory();

  const isLogin = useTRPGSelector((state) => state.user.isLogin);
  useEffect(() => {
    if (isLogin === true) {
      history.replace('/main');
    }
  }, [isLogin]);

  const [{ loading }, handleLogin] = useAsyncFn(async () => {
    const isOldApp = checkIsOldApp();

    dispatch(login(username, password, { isOldApp }));
  }, [username, password, history]);

  const handleRegister = useCallback(() => {
    showToasts('TODO');
  }, []);

  return (
    <Root>
      <LoginContainer>
        <Logo style={{ width: 128, height: 128 }} />

        <h2 style={{ marginBottom: 12, textAlign: 'center' }}>
          {t('欢迎来到TRPG的世界')}
        </h2>

        <Input
          size="large"
          placeholder={t('用户名')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input.Password
          size="large"
          placeholder={t('密码')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          size="large"
          type="primary"
          block={true}
          loading={loading}
          onClick={handleLogin}
        >
          {t('登录')}
        </Button>
        <div style={{ textAlign: 'right' }}>
          <Button type="link" onClick={handleRegister}>
            {t('没有账号？现在注册')}
          </Button>
        </div>

        <LoginFooter>
          <LanguageSwitchLink />

          <Button
            className="home-page"
            type="link"
            onClick={() => window.open(config.url.homepage)}
          >
            {t('官方网站')}
          </Button>
        </LoginFooter>
      </LoginContainer>

      <HiddenInMobile>
        <InfoContainer>
          <Webview src={config.url.loginUrl} />
        </InfoContainer>
      </HiddenInMobile>
    </Root>
  );
});
Login.displayName = 'Login';
