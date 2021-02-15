import React from 'react';
import { connect } from 'react-redux';
import ModalPanel from '../ModalPanel';
import { changePassword, logout } from '@shared/redux/actions/user';
import type { TRPGDispatchProp } from '@redux/types/__all__';
import { closeModal, ModalWrapper } from '../Modal';
import { showToasts } from '@shared/manager/ui';
import { TMemo } from '@shared/components/TMemo';
import { WebFastForm } from '../WebFastForm';
import type { FastFormFieldMeta } from '@shared/components/FastForm/field';
import {
  createFastFormSchema,
  fieldSchema,
} from '@shared/components/FastForm/schema';
import { t } from '@shared/i18n';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { hideModal } from '@redux/actions/ui';

import './ChangePassword.scss';

const schema = createFastFormSchema({
  oldPassword: fieldSchema
    .string()
    .required(t('原密码不能为空'))
    .min(5, t('密码不能小于5位'))
    .max(20, t('密码不能大于20位')),
  newPassword: fieldSchema
    .string()
    .required(t('新密码不能为空'))
    .min(5, t('密码不能小于5位'))
    .max(20, t('密码不能大于20位')),
  newPasswordRepeat: fieldSchema
    .string()
    .required(t('重复密码不能为空'))
    .oneOf(
      [fieldSchema.ref('newPassword')],
      t('重复密码不正确, 请检查您的输入')
    ),
});

const fields: FastFormFieldMeta[] = [
  {
    type: 'password',
    name: 'oldPassword',
    label: t('原密码'),
    maxLength: 20,
    placeholder: t('原密码'),
  },
  {
    type: 'password',
    name: 'newPassword',
    label: t('新密码'),
    maxLength: 20,
    placeholder: t('请输入5~20位新密码'),
  },
  {
    type: 'password',
    name: 'newPasswordRepeat',
    label: t('重复密码'),
    maxLength: 20,
    placeholder: t('再次输入新密码'),
  },
];

/**
 * 修改密码的modal框
 */
export const ChangePassword: React.FC = TMemo(() => {
  const dispatch = useTRPGDispatch();
  const handleSubmit = ({ oldPassword, newPassword }) => {
    dispatch(
      changePassword(
        oldPassword,
        newPassword,
        () => {
          // 成功
          closeModal();
          showToasts(t('密码修改成功'), 'success');
          dispatch(logout());
        },
        (msg) => {
          // 失败
          showToasts(msg, 'error');
        }
      )
    );
  };

  return (
    <ModalWrapper title={t('修改密码')}>
      <WebFastForm schema={schema} fields={fields} onSubmit={handleSubmit} />
    </ModalWrapper>
  );
});
ChangePassword.displayName = 'ChangePassword';

interface Props extends TRPGDispatchProp {}
/**
 * @deprecated 使用新版的
 */
class ChangePasswordOld extends React.Component<Props> {
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
          this.props.dispatch(hideModal());
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
export default connect()(ChangePasswordOld);
