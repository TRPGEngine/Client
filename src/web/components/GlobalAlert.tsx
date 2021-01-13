import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { hideAlert } from '../../shared/redux/actions/ui';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import { Button } from 'antd';

import './GlobalAlert.scss';

/**
 * @deprecated 请使用其他的提示方式
 */

interface Props extends TRPGDispatchProp {
  showAlert: boolean;
  showAlertInfo: any;
  showToast: boolean;
  showToastText: string;
}
class Alert extends React.Component<Props> {
  getAlertContent() {
    const { showAlertInfo = {}, showToastText } = this.props;

    const title = showAlertInfo.title ?? '';
    const content = showAlertInfo.content || showToastText;
    const confirmTitle = showAlertInfo.confirmTitle;
    const onConfirm = showAlertInfo.onConfirm;
    const onCancel = showAlertInfo.onCancel;

    let cancelBtn: ReactNode;
    if (onConfirm) {
      cancelBtn = (
        <Button
          type="primary"
          block={true}
          size="large"
          onClick={() =>
            onCancel ? onCancel() : this.props.dispatch(hideAlert())
          }
        >
          取消
        </Button>
      );
    }

    return (
      <div>
        <div className="header">{title || ''}</div>
        <div className="body">{content || '确认进行该操作?'}</div>
        <div className="action">
          {cancelBtn}
          <Button
            type="primary"
            block={true}
            size="large"
            onClick={() => {
              if (!!onConfirm) {
                onConfirm();
              } else {
                this.props.dispatch(hideAlert());
              }
            }}
          >
            {confirmTitle || '确认'}
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const show = this.props.showAlert || this.props.showToast || false;
    const type = this.props.showAlertInfo.type || 'alert';

    let alertContent: ReactNode = '';
    if (!type || type === 'alert') {
      alertContent = this.getAlertContent();
    }
    let body: ReactNode = '';
    if (show) {
      console.warn('该弹出方式已经被弃用'); // warning

      body = (
        <div className="mask" onClick={(e) => e.stopPropagation()}>
          <div className="content">{alertContent}</div>
        </div>
      );
    }

    return <div className="alert">{body}</div>;
  }
}

const GlobalAlert = connect((state: TRPGState) => ({
  showAlert: state.ui.showAlert,
  showAlertInfo: state.ui.showAlertInfo,

  // 在web端 toast用alert代替
  showToast: state.ui.showToast,
  showToastText: state.ui.showToastText,
}))(Alert);
GlobalAlert.displayName = 'GlobalAlert';

export default GlobalAlert;
