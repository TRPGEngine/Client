import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { hideAlert } from '../../shared/redux/actions/ui';
import './Alert.scss';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';

interface Props extends TRPGDispatchProp {
  showAlert: boolean;
  showAlertInfo: any;
}
class Alert extends React.Component<Props> {
  getAlertContent() {
    const {
      showAlertInfo,
    } = this.props

    const title = showAlertInfo.title ?? '';
    let content = showAlertInfo.content;
    const confirmTitle = showAlertInfo.confirmTitle;
    const onConfirm = showAlertInfo.onConfirm;
    const onCancel = showAlertInfo.onCancel;

    let cancelBtn;
    if (onConfirm) {
      cancelBtn = (
        <button
          onClick={() =>
            onCancel ? onCancel() : this.props.dispatch(hideAlert())
          }
        >
          取消
        </button>
      );
    }
    if (content && content._root) {
      // is immutable
      content = content.toJS();
    }

    return (
      <div>
        <div className="header">{title || ''}</div>
        <div className="body">{content || '确认进行该操作?'}</div>
        <button
          onClick={() => {
            if (!!onConfirm) {
              onConfirm();
            } else {
              this.props.dispatch(hideAlert());
            }
          }}
        >
          {confirmTitle || '确认'}
        </button>
        {cancelBtn}
      </div>
    );
  }

  render() {
    const show = this.props.showAlert || false;
    const type = this.props.showAlertInfo.get('type') || 'alert';

    let alertContent: ReactNode = '';
    if (!type || type === 'alert') {
      alertContent = this.getAlertContent();
    }
    let body: ReactNode = '';
    if (show) {
      body = (
        <div className="mask" onClick={(e) => e.stopPropagation()}>
          <div className="content">{alertContent}</div>
        </div>
      );
    }

    return <div className="alert">{body}</div>;
  }
}

export default connect((state: TRPGState) => ({
  showAlert: state.ui.showAlert,
  showAlertInfo: state.ui.showAlertInfo,
}))(Alert);
