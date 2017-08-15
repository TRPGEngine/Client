const React = require('react');
const { connect } = require('react-redux');
const { Link } = require('react-router-dom');
require('./Login.scss');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  render() {
    return (
      <div className="login-screen">
        <h2>欢迎来到TRPG的世界</h2>
        <input type="text" placeholder="用户名" value={this.state.username} onChange={(e)=>{this.setState({username:e.target.value})}} />
        <input type="password" placeholder="密码" value={this.state.password} onChange={(e)=>{this.setState({password:e.target.value})}} />
        <button onClick={()=>console.log('登录')} disabled={!(this.state.username&&this.state.password&&(this.state.password.length>=6))}>登录</button>
        <Link to="register">没有账号？现在注册</Link>
      </div>
    )
  }
}

module.exports = connect()(Login);
