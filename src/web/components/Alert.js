import React from 'react';
import { connect } from 'react-redux';
import { hideAlert } from '../../redux/actions/ui';
import './Alert.scss';

class Alert extends React.Component {
  getAlertContent() {
    const title = this.props.showAlertInfo.get('title') || '';
    let content = this.props.showAlertInfo.get('content');
    const confirmTitle = this.props.showAlertInfo.get('confirmTitle');
    const onConfirm = this.props.showAlertInfo.get('onConfirm');
    const onCancel = this.props.showAlertInfo.get('onCancel');

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

    let alertContent = '';
    if (!type || type === 'alert') {
      alertContent = this.getAlertContent();
    }
    let body = '';
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

export default connect((state) => ({
  showAlert: state.getIn(['ui', 'showAlert']),
  showAlertInfo: state.getIn(['ui', 'showAlertInfo']),
}))(Alert);
