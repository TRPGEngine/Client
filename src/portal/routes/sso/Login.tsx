import React from 'react';
import styled from 'styled-components';
import { Col } from 'antd';
import qs from 'qs';
import _isString from 'lodash/isString';
import { checkToken } from '@portal/utils/auth';
import { LoginView } from '@portal/components/LoginView';
import { WaveBackground } from '@web/components/WaveBackground';
import { showToasts } from '@shared/manager/ui';

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
      checkToken(false).then(() => {
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
    } else {
      showToasts('无法跳转, 跳转地址不正确', 'error');
    }
  }

  handleLoginSuccess = () => {
    showToasts('登录成功, 正在跳转...', 'success');
    this.gotoNextUrl();
  };

  render() {
    return (
      <Container>
        <Window>
          <LoginView onLoginSuccess={this.handleLoginSuccess} />
        </Window>
        <WaveBackground />
      </Container>
    );
  }
}

export default Login;
