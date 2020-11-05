import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Link } from 'react-router-dom';
import { showLoading } from '@shared/redux/actions/ui';
import { login, loginWithToken } from '@shared/redux/actions/user';
import config from '@shared/project.config';
import rnStorage from '@shared/api/rn-storage.api';
import './Login.scss';
import { TRPGState } from '@redux/types/__all__';
import { showPortal } from '@web/redux/action/ui';
import { checkIsNewApp } from '@web/utils/debug-helper';
import { t } from '@shared/i18n';

interface Props extends DispatchProp<any> {
  isLogin: boolean;
  oauthList: string[];
  history: any;
}
class Login extends React.Component<Props> {
  state = {
    username: '',
    password: '',
  };

  onQQConnectFinished = (e: MessageEvent) => {
    const { type, uuid, token } = e.data;
    if (type === 'onOAuthFinished') {
      if (!uuid || !token) {
        console.error('oauth登录失败, 缺少必要参数', uuid, token);
        return;
      }

      // 注册新的uuid与token并刷新
      rnStorage.set('uuid', uuid);
      rnStorage.set('token', token);

      this.props.dispatch(loginWithToken(uuid, token, 'qq'));
    }
  };

  componentDidMount() {
    if (!!this.props.isLogin) {
      this.props.history.push('main');
    } else {
      window.addEventListener('message', this.onQQConnectFinished);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!!nextProps.isLogin) {
      this.props.history.push('main');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onQQConnectFinished);
  }

  handleLogin() {
    this.props.dispatch(showLoading());
    const username = this.state.username;
    const password = this.state.password;
    const isNewApp = checkIsNewApp();
    this.props.dispatch(login(username, password, { isNewApp }));
  }

  handleQQLogin() {
    console.log('qq登录');
    window.open(
      config.file.url + '/oauth/qq/login',
      'TencentLogin',
      'width=450,height=600'
    );
  }

  handleShowDownloadApp = () => {
    this.props.dispatch(
      showPortal('/deploy', 'standalonewindow', {
        title: '下载APP',
      })
    );
  };

  render() {
    const canLogin =
      this.state.username &&
      this.state.password &&
      this.state.password.length >= 5;

    return (
      <div className="login-screen">
        <h2>{t('欢迎来到TRPG的世界')}</h2>
        <input
          type="text"
          placeholder={t('用户名')}
          value={this.state.username}
          onChange={(e) => {
            this.setState({ username: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder={t('密码')}
          value={this.state.password}
          onChange={(e) => {
            this.setState({ password: e.target.value });
          }}
          onKeyUp={(e) => e.keyCode === 13 && this.handleLogin()}
        />
        <div className="login-area">
          <button
            className={canLogin ? 'active' : ''}
            onClick={() => this.handleLogin()}
            disabled={!canLogin}
          >
            {t('登录')}
          </button>
          {/* {this.props.oauthList.includes('qq') ? (
            <button onClick={() => this.handleQQLogin()}>
              <i className="iconfont">&#xe786;</i>
            </button>
          ) : null} */}
        </div>
        <div className="login-action">
          {/* <a onClick={this.handleShowDownloadApp}>下载移动版APP</a> */}
          <Link to="/register">{t('没有账号？现在注册')}</Link>
        </div>

        <div className="login-page-footer">
          <a href={config.url.homepage} target="_blank" rel="noopener">
            {t('官方网站')}
          </a>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: TRPGState) {
  return {
    isLogin: state.user.isLogin,
    oauthList: (state.settings.config.oauth as string[]) ?? [],
  };
}

export default connect(mapStateToProps)(Login);
