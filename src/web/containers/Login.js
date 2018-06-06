const React = require('react');
const { connect } = require('react-redux');
const { Link } = require('react-router-dom');
const { showLoading } = require('../../redux/actions/ui');
const { login, loginWithToken } = require('../../redux/actions/user');
const config = require('../../../config/project.config.js');
const rnStorage = require('../../api/rnStorage.api.js');
require('./Login.scss');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  componentDidMount() {
    if(!!this.props.isLogin) {
      this.props.history.push('main');
    }else {
      window.addEventListener('message', this.onQQConnectFinished);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if(!!nextProps.isLogin) {
      this.props.history.push('main');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onQQConnectFinished);
  }

  onQQConnectFinished = (e) => {
    let {type, uuid, token} = event.data;
    if(type === 'onOAuthFinished') {
      if(!uuid || !token) {
        console.error('oauth登录失败, 缺少必要参数', uuid, token);
        return;
      }

      // 注册新的uuid与token并刷新
      rnStorage.set('uuid', uuid);
      rnStorage.set('token', token);

      this.props.dispatch(loginWithToken(uuid, token));
    }
  }

  _handleLogin() {
    this.props.dispatch(showLoading());
    let username = this.state.username;
    let password = this.state.password;
    this.props.dispatch(login(username, password));
  }

  _handleQQLogin() {
    console.log('qq登录');
    window.open(config.file.url + '/oauth/qq/login', 'TencentLogin', 'width=450,height=320');
  }

  render() {
    let canLogin = this.state.username && this.state.password && (this.state.password.length>=5);
    return (
      <div className="login-screen">
        <h2>欢迎来到TRPG的世界</h2>
        <input type="text" placeholder="用户名" value={this.state.username} onChange={(e)=>{this.setState({username:e.target.value})}} />
        <input type="password" placeholder="密码" value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}} onKeyUp={(e) => e.keyCode===13 && this._handleLogin()} />
        <div className="loginArea">
          <button className={canLogin?'active':''} onClick={() => this._handleLogin()} disabled={!canLogin}>登录</button>
          <button onClick={() => this._handleQQLogin()}><i className="iconfont">&#xe786;</i></button>
        </div>
        <Link to="register">没有账号？现在注册</Link>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isLogin: state.getIn(['user', 'isLogin'])
  };
}

module.exports = connect(mapStateToProps)(Login);
