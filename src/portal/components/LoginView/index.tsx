import React, { Fragment, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { LoginForm } from './LoginForm';
import { Button } from 'antd';
import { RegisterForm } from './RegisterForm';

interface Props {
  onLoginSuccess?: () => void;
}
export const LoginView: React.FC<Props> = TMemo((props) => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Fragment>
      {!showRegister ? (
        <LoginForm onLoginSuccess={props.onLoginSuccess} />
      ) : (
        <RegisterForm onLoginSuccess={props.onLoginSuccess} />
      )}
      <p style={{ textAlign: 'right' }}>
        {!showRegister ? (
          <Button type="link" onClick={() => setShowRegister(true)}>
            没有账号？现在注册
          </Button>
        ) : (
          <Button type="link" onClick={() => setShowRegister(false)}>
            已有账号？立即登录
          </Button>
        )}
      </p>
    </Fragment>
  );
});
LoginView.displayName = 'LoginView';
