import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { showLoading, showAlert } from '../../redux/actions/ui';
import { register } from '../../redux/actions/user';
import './Register.scss';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordRepeat: '',
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (!!nextProps.isLogin) {
      this.props.history.push('main');
    }
  }

  _handleRegister() {
    this.props.dispatch(showLoading());
    let username = this.state.username;
    let password = this.state.password;
    this.props.dispatch(
      register(username, password, () => {
        this.props.dispatch(
          showAlert({
            content: '注册成功',
          })
        );
      })
    );
  }

  _getErrorMsg() {
    const { username, password, passwordRepeat } = this.state;
    if (!username) {
      return '用户名不能为空';
    }

    if (!/^[A-Za-z\d]{5,16}$/.test(username)) {
      return '用户名必须为5到16位英文或数字';
    }

    if (!password) {
      return '密码不能为空';
    }

    if (!/^[A-Za-z\d]{5,16}$/.test(password)) {
      return '密码必须为5到16位英文或数字';
    }

    if (password !== passwordRepeat) {
      return '重复密码不一致';
    }

    return '';
  }

  render() {
    let errMsg = this._getErrorMsg();
    return (
      <div className="register-screen">
        <h2>注册账号</h2>
        <input
          type="text"
          placeholder="用户名"
          value={this.state.username}
          onChange={(e) => {
            this.setState({ username: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder="密码"
          value={this.state.password}
          onChange={(e) => {
            this.setState({ password: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder="重复密码"
          value={this.state.passwordRepeat}
          onChange={(e) => {
            this.setState({ passwordRepeat: e.target.value });
          }}
        />
        <p>{errMsg}</p>
        <button
          className="active"
          onClick={() => {
            this._handleRegister();
          }}
          disabled={errMsg !== ''}
        >
          成为祭品
        </button>
        <Link to="login">已有账号？现在登录</Link>
      </div>
    );
  }
}

export default connect()(Register);
