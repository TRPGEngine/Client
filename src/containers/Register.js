const React = require('react');
const { connect } = require('react-redux');
const { Link } = require('react-router-dom');
const { showLoading, hideLoading } = require('../redux/actions/ui');
const { register } = require('../redux/actions/user');
require('./Register.scss');

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      repeatPassword: '',
    };
  }

  _handleLogin() {
    this.props.dispatch(showLoading());
    let username = this.state.username;
    let password = this.state.password;
    this.props.dispatch(register(username, password));
  }

  componentWillUpdate(nextProps, nextState) {
    if(!!nextProps.isLogin) {
      this.props.history.push('main');
    }
  }

  _getErrorMsg() {
    const {username, password, repeatPassword} = this.state;
    if(!username) {
      return '用户名不能为空';
    }

    if(username.length < 5) {
      return '用户名不能小于5位';
    }

    if(!password) {
      return '密码不能为空';
    }

    if(password.length < 5) {
      return '密码不能小于5位';
    }

    if(password !== repeatPassword) {
      return '重复密码不一致';
    }

    return '';
  }

  render() {
    let errMsg = this._getErrorMsg();
    return (
      <div className="register-screen">
        <h2>注册账号</h2>
        <input type="text" placeholder="用户名" value={this.state.username} onChange={(e)=>{this.setState({username:e.target.value})}} />
        <input type="password" placeholder="密码" value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}} />
        <input type="password" placeholder="重复密码" value={this.state.repeatPassword} onChange={(e)=>{this.setState({repeatPassword:e.target.value})}} />
        <p>{errMsg}</p>
        <button className="active" onClick={() => {this._handleLogin()}} disabled={errMsg!==''}>注册账号</button>
        <Link to="login">已有账号？现在登录</Link>
      </div>
    )
  }
}

module.exports = connect()(Register);
