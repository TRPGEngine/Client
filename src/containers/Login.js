const React = require('react');
const { connect } = require('react-redux');
require('./Login.scss');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInput: 'normal',
      passwordInput: 'normal',
    };
  }

  render() {
    console.log(this.props);
    return (
      <div className="login-screen">
        <input name="username" />
        <input name="password" />
      </div>
    )
  }
}

module.exports = connect()(Login);
