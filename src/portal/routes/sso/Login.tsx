import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Input, Button, Typography, Modal, notification, Row } from 'antd';
import qs from 'qs';
import _isString from 'lodash/isString';
import { loginWithPassword } from '@portal/model/sso';
import { checkToken } from '@portal/utils/auth';
import { handleError } from '@portal/utils/error';

/**
 * TODO: 登录表单应当使用LoginForm替换
 */

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Window = styled(Col).attrs({
  xs: { span: 22 },
  sm: { span: 16 },
  md: { span: 12 },
  lg: { span: 10 },
  xl: { span: 8 },
})`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  box-shadow: ${(props) => props.theme.boxShadow.normal};
  padding: 16px;
`;

interface Values {
  username: string;
  password: string;
}

class Login extends React.Component {
  componentDidMount() {
    if (window.localStorage.getItem('jwt')) {
      // 处理登录事件
      console.log('正在尝试登录...');
      checkToken()
        .then(() => {
          // 当前Token有效
          this.gotoNextUrl();
        })
        .catch((err) => {
          console.log('当前Token无效', err);
        });
    }
  }

  // 跳转到querystring next参数写的Url
  gotoNextUrl() {
    const query = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    if (_isString(query.next)) {
      window.location.href = decodeURIComponent(query.next);
    }
  }

  handleSubmit = (values: Values) => {
    const { username, password } = values;
    if (!values.username || !values.password) {
      Modal.error({ content: '用户名密码不能为空' });
      return;
    }

    loginWithPassword(username, password)
      .then(() => {
        this.gotoNextUrl();
      })
      .catch(handleError);
  };

  render() {
    return (
      <Container>
        <Window>
          <Col sm={24} md={{ span: 16, offset: 8 }}>
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
              登录TRPG
            </Typography.Title>
          </Col>

          <Formik<Values>
            initialValues={{ username: '', password: '' }}
            onSubmit={this.handleSubmit}
          >
            {({ values, handleChange, handleSubmit }) => (
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
            )}
          </Formik>
        </Window>
      </Container>
    );
  }
}

export default Login;
