import { login } from '@redux/actions/user';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { useTranslation } from '@shared/i18n';
import { registerAccount } from '@shared/model/player';
import { checkIsOldApp } from '@web/utils/debug-helper';
import { handleError } from '@web/utils/error';
import { Button, Input, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsyncFn } from 'react-use';
import { ViewContainer } from './style';

export const RegisterView: React.FC = TMemo(() => {
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
    <ViewContainer>
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
        <Link to="/entry/login" replace={true}>
          <Button type="link" data-testid="login-btn">
            {t('已有账号？现在登录')}
          </Button>
        </Link>
      </div>
    </ViewContainer>
  );
});
RegisterView.displayName = 'RegisterView';
