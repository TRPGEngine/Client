import React, { useCallback, Fragment, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { handleError } from '@portal/utils/error';
import { loginWithPassword } from '@portal/model/sso';
import { message, Input, Button, Col, Typography } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { useFormik } from 'formik';
import _isFunction from 'lodash/isFunction';

interface Values {
  username: string;
  password: string;
}

interface LoginFormProps {
  onLoginSuccess?: () => void;
}
export const LoginForm: React.FC<LoginFormProps> = TMemo((props) => {
  const [loading, setLoading] = useState(false);
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { username: '', password: '' },
    onSubmit: useCallback(
      (values: Values) => {
        const { username, password } = values;
        if (!values.username || !values.password) {
          message.error('用户名密码不能为空');
          return;
        }

        setLoading(true);
        loginWithPassword(username, password)
          .then(() => {
            _isFunction(props.onLoginSuccess) && props.onLoginSuccess();
          })
          .catch(handleError)
          .finally(() => {
            setLoading(false);
          });
      },
      [props.onLoginSuccess, setLoading]
    ),
  });

  return (
    <Fragment>
      <Col sm={24} md={{ span: 16, offset: 8 }}>
        <Typography.Title level={3} style={{ marginBottom: 16 }}>
          登录TRPG
        </Typography.Title>
      </Col>

      <Form
        labelCol={{ sm: 24, md: 8 }}
        wrapperCol={{ sm: 24, md: 16 }}
        onSubmit={handleSubmit}
      >
        <Form.Item label="用户名">
          <Input
            name="username"
            size="large"
            value={values.username}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="密码">
          <Input
            name="password"
            type="password"
            size="large"
            value={values.password}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ sm: 24, md: { span: 16, offset: 8 } }}>
          <Button
            type="primary"
            size="large"
            loading={loading}
            htmlType="submit"
            style={{ width: '100%' }}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
});
LoginForm.displayName = 'LoginForm';
