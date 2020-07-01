import React from 'react';
import { connect } from 'react-redux';
import { tickMember, setMemberToManager } from '@shared/redux/actions/group';
import ModalPanel from '@web/components/ModalPanel';
import config from '@shared/project.config';
import { getUserInfoCache } from '@shared/utils/cache-helper';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';

import './GroupMemberManage.scss';

interface Props extends TRPGDispatchProp {
  uuid: string;
  selectedGroupUUID: string;
}
class GroupMemberManage extends React.Component<Props> {
  handleRaiseManager() {
    this.props.dispatch(
      setMemberToManager(this.props.selectedGroupUUID, this.props.uuid)
    );
  }

  handleTickGroup() {
    this.props.dispatch(
      tickMember(this.props.selectedGroupUUID, this.props.uuid)
    );
  }

  render() {
    let userInfo = getUserInfoCache(this.props.uuid);
    let name = userInfo.nickname || userInfo.username;
    let actions = (
      <div>
        <button onClick={() => this.handleRaiseManager()}>提升为管理</button>
        <button onClick={() => this.handleTickGroup()}>踢出本团</button>
      </div>
    );
    return (
      <ModalPanel title="管理成员" actions={actions}>
        <div className="group-member-manage">
          <div className="avatar">
            <img src={userInfo.avatar || config.defaultImg.getUser(name)} />
          </div>
          <div className="uuid">{userInfo.uuid}</div>
          <p className="name">{name}</p>
          <p className="sign">{userInfo.sign}</p>
        </div>
      </ModalPanel>
    );
  }
}

export default connect((state: TRPGState) => ({
  usercache: state.cache.user,
  selectedGroupUUID: state.group.selectedGroupUUID,
}))(GroupMemberManage);
