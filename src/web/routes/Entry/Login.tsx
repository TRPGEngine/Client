import { login } from '@redux/actions/user';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useTranslation } from '@shared/i18n';
import { showToasts } from '@shared/manager/ui';
import { Logo } from '@web/components/Logo';
import { checkIsOldApp } from '@web/utils/debug-helper';
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import { ViewContainer } from './style';

export const LoginView: React.FC = TMemo(() => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const dispatch = useTRPGDispatch();

  const [{ loading }, handleLogin] = useAsyncFn(async () => {
    if (!username || !password) {
      showToasts(t('请输入账号密码'));
      return;
    }

    const isOldApp = checkIsOldApp();

    dispatch(login(username, password, { isOldApp }));
  }, [username, password, history]);

  return (
    <ViewContainer>
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
        data-testid="login-submit-btn"
        size="large"
        type="primary"
        block={true}
        loading={loading}
        onClick={handleLogin}
      >
        {t('登录')}
      </Button>
      <div style={{ textAlign: 'right' }}>
        <Link to="/entry/register" replace={true}>
          <Button type="link" data-testid="nav-register-btn">
            {t('没有账号？现在注册')}
          </Button>
        </Link>
      </div>
    </ViewContainer>
  );
});
LoginView.displayName = 'LoginView';
