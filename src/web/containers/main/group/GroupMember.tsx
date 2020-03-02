import React from 'react';
import { connect } from 'react-redux';
import config from '@shared/project.config';
import moment from 'moment';
import { showModal, showProfileCard } from '@shared/redux/actions/ui';
import GroupMemberManage from './modal/GroupMemberManage';
import { getUserInfoCache } from '@shared/utils/cache-helper';
import { TRPGDispatch, TRPGState } from '@redux/types/__all__';

import './GroupMember.scss';

interface Props {
  userUUID: string;
  selectedGroupUUID: string;
  groupInfo: any;
  isGroupManager: boolean;
  showModal: any;
  showProfileCard: any;
}
class GroupMember extends React.Component<Props> {
  handleManageMember(uuid) {
    this.props.showModal(<GroupMemberManage uuid={uuid} />);
  }

  getMemberList() {
    const groupInfo = this.props.groupInfo;
    const hasManagerAuth =
      groupInfo.managers_uuid.indexOf(this.props.userUUID) >= 0;
    if (groupInfo.group_members) {
      return (groupInfo.group_members || []).map((uuid) => {
        const user = getUserInfoCache(uuid);
        const last_login = user.last_login
          ? moment(user.last_login).format('YYYY-M-D HH:mm:ss')
          : '从未登录';
        const isManager = groupInfo.managers_uuid.indexOf(uuid) >= 0;
        const isOwner = groupInfo.owner_uuid === uuid;
        const auth = isOwner ? 'owner' : isManager ? 'manager' : 'none';
        const name = user.nickname || user.username;
        return (
          <tr
            key={`group-member#${this.props.selectedGroupUUID}#${uuid}`}
            className="group-member-item"
          >
            <td className={'auth ' + auth}>
              <i className="iconfont">&#xe648;</i>
            </td>
            <td className="avatar">
              <img src={user.avatar || config.defaultImg.getUser(name)} />
            </td>
            <td className="name">{name}</td>
            <td className="last-login">{last_login}</td>
            <td className="actions">
              {hasManagerAuth ? (
                <button onClick={() => this.handleManageMember(uuid)}>
                  <i className="iconfont">&#xe83f;</i>
                </button>
              ) : null}
              <button onClick={() => this.props.showProfileCard(uuid)}>
                <i className="iconfont">&#xe61b;</i>
              </button>
            </td>
          </tr>
        );
      });
    }
  }

  render() {
    return (
      <table className="group-members" cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <td />
            <td>头像</td>
            <td>名字</td>
            <td>上次登录</td>
            <td>操作</td>
          </tr>
        </thead>
        <tbody>{this.getMemberList()}</tbody>
      </table>
    );
  }
}

export default connect(
  (state: TRPGState) => {
    const userUUID = state.user.info.uuid;
    const selectedGroupUUID = state.group.selectedGroupUUID;
    const groupInfo = state.group.groups.find(
      (group) => group.uuid === selectedGroupUUID
    );

    return {
      userUUID,
      selectedGroupUUID: selectedGroupUUID,
      groupInfo,
      usercache: state.cache.user,
    };
  },
  (dispatch: TRPGDispatch) => ({
    showModal: (body) => dispatch(showModal(body)),
    showProfileCard: (uuid) => dispatch(showProfileCard(uuid)),
  })
)(GroupMember);
