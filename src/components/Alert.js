const React = require('react');
const {connect} = require('react-redux');
const PropTypes = require('prop-types');
const {hideAlert} = require('../redux/actions/ui');
require('./Alert.scss');

class Alert extends React.Component {
  getAlertContent(title, content, onConfirm) {
    let cancelBtn;
    if(onConfirm) {
      cancelBtn = (
        <button onClick={() => this.props.dispatch(hideAlert())}>
          取消
        </button>
      )
    }

    return (
      <div>
        <div className="header">{title || '警告'}</div>
        <div className="body">{content || '确认进行该操作?'}</div>
        <button onClick={() => {
          if(!!onConfirm) {
            onConfirm();
          }else{
            this.props.dispatch(hideAlert());
          }
        }}>
          确认
        </button>
        { cancelBtn }
      </div>
    )
  }

  render() {
    const {show, type, title, content, onConfirm, onCancel} = this.props;
    let alertContent = '';
    if(!type || type==='alert') {
      alertContent = this.getAlertContent(title, content, onConfirm, onCancel);
    }
    let body = '';
    if(this.props.show) {
      body = (
        <div className="mask">
          <div className="content">
            {alertContent}
          </div>
        </div>
      )
    }

    return (
      <div className="alert">
        {body}
      </div>
    )
  }
}

Alert.defaultProps = {
  show: false,
  content: '',
  onConfirm: null,
}

Alert.propTypes = {
  show: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
}

module.exports = connect()(Alert);
