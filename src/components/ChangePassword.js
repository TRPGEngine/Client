const React = require('react');
const ModalPanel = require('./ModalPanel');

require('./ChangePassword.scss');

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      oldPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
    }
  }

  _handleChangePassword() {
    this.setState({error: ''});
    if(!this.state.newPassword || !this.state.oldPassword) {
      this.setState({error: '密码不能为空'});
      return;
    }
    if(this.state.newPassword.length < 5 || this.state.oldPassword.length < 5) {
      this.setState({error: '密码不能小于5位'});
      return;
    }
    if(this.state.newPassword !== this.state.newPasswordRepeat) {
      this.setState({error: '重复密码不正确, 请检查您的输入'});
      return;
    }

    // TODO:发送修改密码请求
  }

  render() {
    let actions = (
      <button onClick={() => this._handleChangePassword()}>
        确认修改
      </button>
    )

    return (
      <ModalPanel title="修改密码" actions={actions}>
        <div className="change-password">
          <input type="password" placeholder="原密码" value={this.state.oldPassword} onChange={(e) => this.setState({oldPassword: e.target.value})} />
          <input type="password" placeholder="请输入5~20位新密码" value={this.state.newPassword} onChange={(e) => this.setState({newPassword: e.target.value})} />
          <input type="password" placeholder="再次输入新密码" value={this.state.newPasswordRepeat} onChange={(e) => this.setState({newPasswordRepeat: e.target.value})} />
          <p className="tip">tip: 一旦确认修改无法撤回，请三思后行</p>
          <p className="error-msg">{this.state.error}</p>
        </div>
      </ModalPanel>
    )
  }
}

module.exports = ChangePassword;
