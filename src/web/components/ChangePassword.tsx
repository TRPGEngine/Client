import React from 'react';
import { connect } from 'react-redux';
import ModalPanel from './ModalPanel';
import { changePassword, logout } from '@shared/redux/actions/user';
import type { TRPGDispatchProp } from '@redux/types/__all__';

import './ChangePassword.scss';
import { showToasts } from '@shared/manager/ui';
import { closeModal } from './Modal';

interface Props extends TRPGDispatchProp {}
class ChangePassword extends React.Component<Props> {
  state = {
    error: '',
    oldPassword: '',
    newPassword: '',
    newPasswordRepeat: '',
  };

  handleChangePassword() {
    this.setState({ error: '' });
    if (!this.state.newPassword || !this.state.oldPassword) {
      this.setState({ error: '密码不能为空' });
      return;
    }
    if (
      this.state.newPassword.length < 5 ||
      this.state.oldPassword.length < 5
    ) {
      this.setState({ error: '密码不能小于5位' });
      return;
    }
    if (this.state.newPassword !== this.state.newPasswordRepeat) {
      this.setState({ error: '重复密码不正确, 请检查您的输入' });
      return;
    }

    this.props.dispatch(
      changePassword(
        this.state.oldPassword,
        this.state.newPassword,
        () => {
          // 成功
          closeModal();
          showToasts('密码修改成功', 'success');
          this.props.dispatch(logout());
        },
        (msg) => {
          // 失败
          this.setState({ error: msg });
        }
      )
    );
  }

  render() {
    const actions = (
      <button onClick={() => this.handleChangePassword()}>确认修改</button>
    );

    return (
      <ModalPanel title="修改密码" actions={actions}>
        <div className="change-password">
          <input
            type="password"
            placeholder="原密码"
            value={this.state.oldPassword}
            onChange={(e) => this.setState({ oldPassword: e.target.value })}
          />
          <input
            type="password"
            placeholder="请输入5~20位新密码"
            value={this.state.newPassword}
            onChange={(e) => this.setState({ newPassword: e.target.value })}
          />
          <input
            type="password"
            placeholder="再次输入新密码"
            value={this.state.newPasswordRepeat}
            onChange={(e) =>
              this.setState({ newPasswordRepeat: e.target.value })
            }
          />
          <p className="tip">tip: 一旦确认修改无法撤回，请三思后行</p>
          <p className="error-msg">{this.state.error}</p>
        </div>
      </ModalPanel>
    );
  }
}

export default connect()(ChangePassword);
