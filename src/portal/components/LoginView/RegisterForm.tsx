import React, { useCallback, useState, Fragment } from 'react';
import { WebFastForm } from '@web/components/WebFastForm';
import { TMemo } from '@shared/components/TMemo';
import { FastFormFieldMeta } from '@shared/components/FastForm';
import { message, Col, Typography } from 'antd';
import { registerAccount } from '@portal/model/player';
import { handleError } from '@portal/utils/error';
import _isFunction from 'lodash/isFunction';
import { loginWithPassword } from '@shared/model/player';

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
        await loginWithPassword(username, password); // 注册成功后自动登录

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
