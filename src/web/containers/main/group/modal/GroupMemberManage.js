import React from 'react';
import { connect } from 'react-redux';
import {
  tickMember,
  setMemberToManager,
} from '../../../../../redux/actions/group';
import ModalPanel from '../../../../components/ModalPanel';
import config from '../../../../../../config/project.config';
import { getUserInfoCache } from '../../../../../shared/utils/cacheHelper';

require('./GroupMemberManage.scss');

class GroupMemberManage extends React.Component {
  _handleRaiseManager() {
    this.props.dispatch(
      setMemberToManager(this.props.selectedGroupUUID, this.props.uuid)
    );
  }

  _handleTickGroup() {
    this.props.dispatch(
      tickMember(this.props.selectedGroupUUID, this.props.uuid)
    );
  }

  render() {
    let userInfo = getUserInfoCache(this.props.uuid);
    let name = userInfo.get('nickname') || userInfo.get('username');
    let actions = (
      <div>
        <button onClick={() => this._handleRaiseManager()}>提升为管理</button>
        <button onClick={() => this._handleTickGroup()}>踢出本团</button>
      </div>
    );
    return (
      <ModalPanel title="管理成员" actions={actions}>
        <div className="group-member-manage">
          <div className="avatar">
            <img
              src={userInfo.get('avatar') || config.defaultImg.getUser(name)}
            />
          </div>
          <div className="uuid">{userInfo.get('uuid')}</div>
          <p className="name">{name}</p>
          <p className="sign">{userInfo.get('sign')}</p>
        </div>
      </ModalPanel>
    );
  }
}

export default connect((state) => ({
  usercache: state.getIn(['cache', 'user']),
  selectedGroupUUID: state.getIn(['group', 'selectedGroupUUID']),
}))(GroupMemberManage);
