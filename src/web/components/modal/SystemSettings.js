import React from 'react';
import { connect } from 'react-redux';
import ModalPanel from '../ModalPanel';
import Checkbox from '../Checkbox';
import {
  setSystemSettings,
  saveSettings,
} from '../../../redux/actions/settings';

require('./SystemSettings.scss');

class SystemSettings extends React.Component {
  componentWillUnmount() {
    this.props.dispatch(saveSettings());
  }

  _handleRequestNotificationPermission(isChecked) {
    this.props.dispatch(setSystemSettings({ notification: isChecked }));
  }

  render() {
    return (
      <ModalPanel title="系统设置" className="system-settings">
        <div className="setting-cell">
          <label>桌面通知权限({this.props.notificationPermission})</label>
          <Checkbox
            value={this.props.systemSettings.get('notification')}
            onChange={(isChecked) =>
              this._handleRequestNotificationPermission(isChecked)
            }
          />
        </div>
      </ModalPanel>
    );
  }
}

export default connect((state) => ({
  notificationPermission: state.getIn(['settings', 'notificationPermission']),
  systemSettings: state.getIn(['settings', 'system']),
}))(SystemSettings);
