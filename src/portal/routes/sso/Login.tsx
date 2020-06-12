import React from 'react';
import styled from 'styled-components';
import '@ant-design/compatible/assets/index.css';
import { Col } from 'antd';
import qs from 'qs';
import _isString from 'lodash/isString';
import { checkToken } from '@portal/utils/auth';
import { LoginForm } from '@portal/components/LoginView/LoginForm';

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

class Login extends React.Component {
  componentDidMount() {
    if (window.localStorage.getItem('jwt')) {
      // 处理登录事件
      console.log('正在尝试登录...');
      checkToken().then(() => {
        // 当前Token有效
        this.gotoNextUrl();
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

  handleLoginSuccess = () => {
    this.gotoNextUrl();
  };

  render() {
    return (
      <Container>
        <Window>
          <LoginForm onLoginSuccess={this.handleLoginSuccess} />
        </Window>
      </Container>
    );
  }
}

export default Login;
