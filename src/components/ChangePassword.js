const React = require('react');

require('./ChangePassword.scss');

class ChangePassword extends React.Component {
  render() {
    return (
      <div className="change-password">
        <input type="password" placeholder="原密码" />
        <input type="password" placeholder="新密码" />
        <input type="password" placeholder="重复新密码" />
        <button>确认修改</button>
        <p className="tip">tip: 一旦确认修改无法撤回，请三思后行</p>
      </div>
    )
  }
}

module.exports = ChangePassword;
