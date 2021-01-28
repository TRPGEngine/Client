import React, { useCallback, useState, Fragment } from 'react';
import { WebFastForm } from '@web/components/WebFastForm';
import { TMemo } from '@shared/components/TMemo';
import { message, Col, Typography } from 'antd';
import { handleError } from '@web/utils/error';
import _isFunction from 'lodash/isFunction';
import { registerAccount } from '@shared/model/player';
import type { FastFormFieldMeta } from '@shared/components/FastForm/field';
import { trackEvent } from '@web/utils/analytics-helper';
import { loginPortalWithPassword } from '@portal/model/user';
import { t } from '@shared/i18n';

const fields: FastFormFieldMeta[] = [
  {
    type: 'text',
    name: 'username',
    label: t('用户名'),
  },
  {
    type: 'password',
    name: 'password',
    label: t('密码'),
  },
  {
    type: 'password',
    name: 'passwordReply',
    label: t('重复密码'),
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
        message.error(t('用户名不能为空'));
        return;
      }
      if (password === '') {
        message.error(t('密码不能为空'));
        return;
      }
      if (passwordReply === '') {
        message.error(t('重复密码不能为空'));
        return;
      }
      if (password !== passwordReply) {
        message.error(t('重复密码不正确'));
        return;
      }

      try {
        await registerAccount(username, password);
        trackEvent('portal:register', {
          username,
        });

        await loginPortalWithPassword(username, password); // 注册成功后自动登录
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
          {t('注册 TRPG Engine 账号')}
        </Typography.Title>
      </Col>

      <WebFastForm
        submitLabel={t('注册')}
        fields={fields}
        onSubmit={handleSubmit}
      />
    </Fragment>
  );
});
RegisterForm.displayName = 'RegisterForm';
