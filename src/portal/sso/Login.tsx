import React from 'react';
import styled from 'styled-components';
import { Formik } from 'formik';
import { Input, Button, Form, Typography, Modal } from 'antd';
import { request } from '@portal/utils/request';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Window = styled.div`
  width: 80%;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  box-shadow: ${(props) => props.theme.boxShadow.normal};
  padding: 10px;
`;

interface Values {
  username: string;
  password: string;
}

class Login extends React.Component {
  componentDidMount() {
    if (window.localStorage.getItem('jwt')) {
      // 处理登录事件
      // TODO
    }
  }

  handleSubmit = (values: Values) => {
    const { username, password } = values;
    if (!values.username || !values.password) {
      Modal.error({ content: '用户名密码不能为空' });
      return;
    }

    request
      .post('/player/sso/login', {
        username,
        password,
      })
      .then(({ data }) => alert(JSON.stringify(data)));
  };

  render() {
    return (
      <Container>
        <Window>
          <Typography>
            <Typography.Title level={3}>登录TRPG</Typography.Title>
          </Typography>

          <Formik<Values>
            initialValues={{ username: '', password: '' }}
            onSubmit={this.handleSubmit}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
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
                <Form.Item>
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
