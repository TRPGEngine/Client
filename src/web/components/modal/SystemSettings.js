const React = require('react');
const { connect } = require('react-redux');
const ModalPanel = require('../ModalPanel');
const Checkbox = require('../Checkbox');
const { requestNotification } = require('../../../redux/actions/ui');

class SystemSettings extends React.Component {
  _handleRequestNotificationPermission(isChecked) {
    this.props.dispatch(requestNotification(isChecked));
  }

  render() {
    return (
      <ModalPanel title="系统设置" className="system-settings">
        <div>
          <label>桌面通知权限({this.props.notificationPermission})</label>
          <Checkbox
            value={this.props.notificationPermission==='granted'}
            onChange={(isChecked) => this._handleRequestNotificationPermission(isChecked)} />
        </div>
      </ModalPanel>
    )
  }
}

module.exports = connect(
  state => ({
    notificationPermission: state.getIn(['ui', 'notificationPermission']),
  })
)(SystemSettings);
