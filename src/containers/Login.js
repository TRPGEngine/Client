const React = require('react');
const { connect } = require('react-redux');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInput: 'normal',
      passwordInput: 'normal',
    };
  }

  render() {
    return (
      <div>login</div>
    )
  }
}

module.exports = Login;
