import React from 'react';
import { connect } from 'react-redux';
import ModalPanel from '../ModalPanel';
import Checkbox from '../Checkbox';
import {
  setSystemSettings,
  saveSettings,
} from '../../../shared/redux/actions/settings';

import './SystemSettings.scss';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';

interface Props extends TRPGDispatchProp {
  notificationPermission: string;
  systemSettings: any;
}
class SystemSettings extends React.Component<Props> {
  componentWillUnmount() {
    this.props.dispatch(saveSettings());
  }

  handleRequestNotificationPermission(isChecked) {
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
              this.handleRequestNotificationPermission(isChecked)
            }
          />
        </div>
      </ModalPanel>
    );
  }
}

export default connect((state: TRPGState) => ({
  notificationPermission: state.settings.notificationPermission,
  systemSettings: state.settings.system,
}))(SystemSettings);
