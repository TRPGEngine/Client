import React, { useCallback, useState, Fragment } from 'react';
import { WebFastForm } from '@web/components/WebFastForm';
import { TMemo } from '@shared/components/TMemo';
import { message, Col, Typography } from 'antd';
import { handleError } from '@web/utils/error';
import _isFunction from 'lodash/isFunction';
import { loginWithPassword, registerAccount } from '@shared/model/player';
import { FastFormFieldMeta } from '@shared/components/FastForm/field';
import { setPortalJWT } from '@portal/utils/auth';

const fields: FastFormFieldMeta[] = [
  {
    type: 'text',
    name: 'username',
    label: '用户名',
  },
  {
    type: 'password',
    name: 'password',
    label: '密码',
  },
  {
    type: 'password',
    name: 'passwordReply',
    label: '重复密码',
  },
];

interface RegisterFormProps {
  onLoginSuccess?: () => void;
}
export const RegisterForm: React.FC<RegisterFormProps> = TMemo((props) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(
    async (values) => {
      const { username, password, passwordReply } = values;
      if (username === '') {
        message.error('用户名不能为空');
        return;
      }
      if (password === '') {
        message.error('密码不能为空');
        return;
      }
      if (passwordReply === '') {
        message.error('重复密码不能为空');
        return;
      }
      if (password !== passwordReply) {
        message.error('重复密码不正确');
        return;
      }

      try {
        await registerAccount(username, password);
        const { jwt } = await loginWithPassword(username, password); // 注册成功后自动登录

        setPortalJWT(jwt);
        _isFunction(props.onLoginSuccess) && props.onLoginSuccess();
      } catch (err) {
        handleError(err);
      }
    },
    [setLoading]
  );

  return (
    <Fragment>
      <Col sm={24} md={{ span: 16, offset: 8 }}>
        <Typography.Title level={3} style={{ marginBottom: 16 }}>
          注册TRPG Engine 账号
        </Typography.Title>
      </Col>

      <WebFastForm submitLabel="注册" fields={fields} onSubmit={handleSubmit} />
    </Fragment>
  );
});
RegisterForm.displayName = 'RegisterForm';
