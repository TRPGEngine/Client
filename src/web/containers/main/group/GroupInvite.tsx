import React from 'react';
import { connect } from 'react-redux';
import config from '@shared/project.config';
import ReactTooltip from 'react-tooltip';
import { sendGroupInvite } from '@shared/redux/actions/group';
import { getUserInfoCache } from '@shared/utils/cache-helper';
import { TRPGState, TRPGDispatch } from '@redux/types/__all__';

import './GroupInvite.scss';

/**
 * @deprecated
 */

interface Props {
  selectedGroupUUID: string;
  friendList: any[];
  groupMembers: any[];
  sendGroupInvite: any;
}
class GroupInvite extends React.Component<Props> {
  state = {
    selectedUUIDs: [],
  };

  handleSelect(uuid) {
    const selectedUUIDs = this.state.selectedUUIDs;
    const index = selectedUUIDs.indexOf(uuid);
    if (index >= 0) {
      selectedUUIDs.splice(index, 1);
      this.setState({ selectedUUIDs });
    } else {
      selectedUUIDs.push(uuid);
      this.setState({ selectedUUIDs });
    }
  }

  handleSendGroupInvite() {
    console.log('handleSendGroupInvite', this.state.selectedUUIDs);
    const groupUUID = this.props.selectedGroupUUID;
    for (const uuid of this.state.selectedUUIDs) {
      // TODO 需要一个待处理的group邀请列表，防止多次提交邀请
      this.props.sendGroupInvite(groupUUID, uuid);
    }
  }

  render() {
    return (
      <div className="group-invite">
        <ReactTooltip effect="solid" />
        <div className="friend-list">
          {this.props.friendList.map((uuid) => {
            if (this.props.groupMembers.indexOf(uuid) >= 0) {
              return;
            }

            const user = getUserInfoCache(uuid);
            const name = user.nickname || user.username;

            return (
              <div
                key={'group-invite#friend#' + uuid}
                className={
                  'item' +
                  (this.state.selectedUUIDs.indexOf(uuid) >= 0 ? ' active' : '')
                }
                onClick={() => this.handleSelect(uuid)}
                data-tip={name}
              >
                <div className="avatar">
                  <img src={user.avatar || config.defaultImg.getUser(name)} />
                </div>
                <div className="mask" />
              </div>
            );
          })}
        </div>
        <i className="iconfont">&#xe606;</i>
        <div className="invite-list">
          {this.props.groupMembers.map((uuid) => {
            const user = getUserInfoCache(uuid);
            const name = user.nickname || user.username;

            return (
              <div
                key={'group-invite#groupMembers#' + uuid}
                className={'item-solid'}
                onClick={() => console.log(uuid)}
                data-tip={name}
              >
                <div className="avatar">
                  <img src={user.avatar || config.defaultImg.getUser(name)} />
                </div>
                <div className="mask" />
              </div>
            );
          })}
        </div>
        <button onClick={() => this.handleSendGroupInvite()}>发送邀请</button>
      </div>
    );
  }
}

export default connect(
  (state: TRPGState) => {
    const selectedGroupUUID = state.group.selectedGroupUUID;
    const groupInfo = state.group.groups.find(
      (group) => group.uuid === selectedGroupUUID
    );
    return {
      usercache: state.cache.user,
      friendList: state.user.friendList,
      selectedGroupUUID,
      groupInfo,
      groupMembers: groupInfo.group_members ?? [],
    };
  },
  (dispatch: TRPGDispatch) => ({
    sendGroupInvite: (group_uuid, to_uuid) =>
      dispatch(sendGroupInvite(group_uuid, to_uuid)),
  })
)(GroupInvite);
