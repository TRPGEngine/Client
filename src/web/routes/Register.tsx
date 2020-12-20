import { login } from '@redux/actions/user';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGDispatch,
  useTRPGSelector,
} from '@shared/hooks/useTRPGSelector';
import { useTranslation } from '@shared/i18n';
import { registerAccount } from '@shared/model/player';
import config from '@shared/project.config';
import { HiddenInMobile } from '@web/components/HiddenInMobile';
import Webview from '@web/components/Webview';
import { checkIsOldApp } from '@web/utils/debug-helper';
import { handleError } from '@web/utils/error';
import { Button, Input, Space, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import styled from 'styled-components';
import loginPatternUrl from '../assets/img/login-pattern.svg';

const Root = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const RegisterContainer = styled(Space).attrs({
  direction: 'vertical',
  size: 12,
})`
  background-color: ${(props) => props.theme.color.graySet[7]};
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

const InfoContainer = styled.div`
  flex: 1;
  background-color: white;
`;

const RegisterView: React.FC = TMemo(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const { t } = useTranslation();
  const dispatch = useTRPGDispatch();

  const [{ loading }, handleRegister] = useAsyncFn(async () => {
    try {
      await registerAccount(username, password);

      // 注册成功后自动登录
      const isOldApp = checkIsOldApp();

      dispatch(login(username, password, { isOldApp }));
    } catch (err) {
      handleError(err);
    }
  }, [username, password]);

  const errorMsg = useMemo(() => {
    if (!username) {
      return t('用户名不能为空');
    }

    if (!/^[A-Za-z\d]{5,16}$/.test(username)) {
      return t('用户名必须为5到16位英文或数字');
    }

    if (!password) {
      return t('密码不能为空');
    }

    if (!/^[A-Za-z\d]{5,16}$/.test(password)) {
      return t('密码必须为5到16位英文或数字');
    }

    if (password !== passwordRepeat) {
      return t('重复密码不一致');
    }

    return '';
  }, [username, password, passwordRepeat]);

  return (
    <RegisterContainer>
      <h2>{t('注册账号')}</h2>
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
      <Input.Password
        size="large"
        placeholder={t('重复密码')}
        value={passwordRepeat}
        onChange={(e) => setPasswordRepeat(e.target.value)}
      />
      <Typography.Text type="danger">{errorMsg}</Typography.Text>
      <Button
        size="large"
        type="primary"
        block={true}
        loading={loading}
        onClick={handleRegister}
        disabled={errorMsg !== ''}
      >
        {t('注册')}
      </Button>
      <div style={{ textAlign: 'right' }}>
        <Link to="/login" replace={true}>
          <Button type="link">{t('已有账号？现在登录')}</Button>
        </Link>
      </div>
    </RegisterContainer>
  );
});
RegisterView.displayName = 'RegisterView';

/**
 * TODO: 需要合并
 */
function useWatchLoginStatus() {
  const history = useHistory();
  const isLogin = useTRPGSelector((state) => state.user.isLogin);
  useEffect(() => {
    if (isLogin === true) {
      history.replace('/main');
    }
  }, [isLogin]);
}

export const Register: React.FC = TMemo(() => {
  useWatchLoginStatus();

  return (
    <Root>
      <RegisterView />

      <HiddenInMobile>
        <InfoContainer>
          <Webview src={config.url.loginUrl} />
        </InfoContainer>
      </HiddenInMobile>
    </Root>
  );
});
Register.displayName = 'Register';
