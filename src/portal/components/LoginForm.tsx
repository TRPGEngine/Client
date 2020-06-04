import React, { useCallback, Fragment } from 'react';
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
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { username: '', password: '' },
    onSubmit: useCallback(
      (values: Values) => {
        const { username, password } = values;
        if (!values.username || !values.password) {
          message.error('用户名密码不能为空');
          return;
        }

        loginWithPassword(username, password)
          .then(() => {
            _isFunction(props.onLoginSuccess) && props.onLoginSuccess();
          })
          .catch(handleError);
      },
      [props.onLoginSuccess]
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
            htmlType="submit"
            style={{ width: '100%' }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
});
LoginForm.displayName = 'LoginForm';
