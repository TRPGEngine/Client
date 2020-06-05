import React, { useEffect, useState, Fragment } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { checkToken } from '@portal/utils/auth';
import Loading from './Loading';
import { LoginForm } from './LoginForm';

/**
 * 一个确保登录的组件
 * 确保子组件在登录后的情况下才能显示出来
 * 如果没有登录则显示登录界面
 */

export const LoginEnsureContainer: React.FC = TMemo((props) => {
  const [checking, setChecking] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    setChecking(true);

    checkToken(false)
      .then(() => {
        setIsLogin(true);
      })
      .catch(() => {
        setIsLogin(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    return <Loading />;
  }

  if (isLogin) {
    return <Fragment>{props.children}</Fragment>;
  } else {
    return <LoginForm onLoginSuccess={() => setIsLogin(true)} />;
  }
});
LoginEnsureContainer.displayName = 'LoginEnsureContainer';
