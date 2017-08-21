const React = require('react');
const {connect} = require('react-redux');
const PropTypes = require('prop-types');
const {hideAlert} = require('../redux/actions/ui');
require('./Alert.scss');

class Alert extends React.Component {
  getAlertContent(title, content, onConfirm) {
    return (
      <div>
        <h2>{title || '警告'}</h2>
        <p>{content || '确认进行该操作?'}</p>
        <button onClick={() => {
          if(!!onConfirm) {
            onConfirm();
          }else{
            this.props.dispatch(hideAlert());
          }
        }}>
          确认
        </button>
      </div>
    )
  }

  render() {
    const {show, type, title, content, onConfirm} = this.props;
    let alertContent = '';
    if(!type || type==='alert') {
      alertContent = this.getAlertContent(title, content, onConfirm);
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
  content: PropTypes.string,
  onConfirm: PropTypes.func,
}

module.exports = connect()(Alert);
