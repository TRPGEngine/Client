const React = require('react');
const { connect } = require('react-redux');
const ModalPanel = require('../ModalPanel');
const Checkbox = require('../Checkbox');
const { setSystemSettings } = require('../../../redux/actions/settings');

require('./SystemSettings.scss');

class SystemSettings extends React.Component {
  componentWillUnmount() {
    // TODO: 把设置上传到服务器
  }

  _handleRequestNotificationPermission(isChecked) {
    this.props.dispatch(setSystemSettings({notification: isChecked}));
  }

  render() {
    return (
      <ModalPanel title="系统设置" className="system-settings">
        <div className="setting-cell">
          <label>桌面通知权限({this.props.notificationPermission})</label>
          <Checkbox
            value={this.props.systemSettings.get('notification')}
            onChange={(isChecked) => this._handleRequestNotificationPermission(isChecked)}
          />
        </div>
      </ModalPanel>
    )
  }
}

module.exports = connect(
  state => ({
    notificationPermission: state.getIn(['settings', 'notificationPermission']),
    systemSettings: state.getIn(['settings', 'system']),
  })
)(SystemSettings);
