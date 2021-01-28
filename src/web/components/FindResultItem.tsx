import React from 'react';
import { connect } from 'react-redux';
import config from '@shared/project.config';
import {
  sendFriendInvite,
  agreeFriendInvite,
} from '@shared/redux/actions/user';
import { requestJoinGroup } from '@shared/redux/actions/group';
import type { TRPGState, TRPGDispatch } from '@redux/types/__all__';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { showModal } from '@redux/actions/ui';
import PopoverGroupInfo from './popover/GroupInfo';
import { Popover } from 'antd';
import { getUserName } from '@shared/utils/data-helper';
import Avatar from './Avatar';

import './FindResultItem.scss';

interface Props {
  friendList: string[];
  friendInvite: any;
  friendRequests: any;
  selfUUID: string;
  joinedGroupUUIDs: string[];
  requestingGroupUUID: string[];
  agreeFriendInvite: (uuid: string) => void;
  sendFriendInvite: (uuid: string) => void;
  requestJoinGroup: (uuid: string) => void;
  showModal: (body) => void;

  info: any;
  type?: string;
}
class FindResultItem extends React.Component<Props> {
  getUserAction(uuid: string) {
    const friendList = this.props.friendList;
    const friendInvite = this.props.friendInvite.map((item) => item.from_uuid);
    const friendRequests = this.props.friendRequests.map(
      (item) => item.from_uuid
    );
    const selfUUID = this.props.selfUUID;
    if (selfUUID === uuid) {
      return (
        <button disabled={true}>
          <i className="iconfont">&#xe607;</i>我自己
        </button>
      );
    } else if (friendList.indexOf(uuid) >= 0) {
      return (
        <button disabled={true}>
          <i className="iconfont">&#xe604;</i>已添加
        </button>
      );
    } else if (friendInvite.indexOf(uuid) >= 0) {
      return (
        <button disabled={true}>
          <i className="iconfont">&#xe62e;</i>已发送
        </button>
      );
    } else if (friendRequests.indexOf(uuid) >= 0) {
      return (
        <button onClick={() => this.props.agreeFriendInvite(uuid)}>
          <i className="iconfont">&#xe67d;</i>同意
        </button>
      );
    } else {
      return (
        <button onClick={() => this.props.sendFriendInvite(uuid)}>
          <i className="iconfont">&#xe604;</i>添加好友
        </button>
      );
    }
  }

  getGroupAction(uuid) {
    const joinedGroupUUIDs = this.props.joinedGroupUUIDs;
    const requestingGroupUUID = this.props.requestingGroupUUID;
    if (joinedGroupUUIDs.includes(uuid)) {
      return (
        <button disabled={true}>
          <i className="iconfont">&#xe604;</i>已加入
        </button>
      );
    } else if (requestingGroupUUID.includes(uuid)) {
      return (
        <button disabled={true}>
          <i className="iconfont">&#xe604;</i>已申请
        </button>
      );
    } else {
      return (
        <button onClick={() => this.props.requestJoinGroup(uuid)}>
          <i className="iconfont">&#xe604;</i>添加团
        </button>
      );
    }
  }

  render() {
    const info = this.props.info;
    const type = this.props.type || 'user';

    if (type === 'user') {
      const name = getUserName(info);
      return (
        <div className="find-result-item">
          <div className="avatar">
            <Avatar size={60} src={info.avatar} name={name} />
          </div>
          <div className="profile">
            <span className="username">{name}</span>
            <span className="uuid">{info.uuid}</span>
          </div>
          <div className="action">{this.getUserAction(info.uuid)}</div>
        </div>
      );
    } else if (type === 'group') {
      return (
        <div className="find-result-item">
          <Popover
            placement="right"
            content={<PopoverGroupInfo groupUUID={info.uuid} />}
          >
            <div className="avatar">
              <Avatar size={60} src={info.avatar} name={info.name} />
            </div>
          </Popover>
          <div className="profile">
            <span className="username">
              {info.name}
              {!_isNil(info.members_count) && (
                <small>
                  ({info.members_count}/{info.max_member})
                </small>
              )}
            </span>
            <span className="uuid">{info.uuid}</span>
          </div>
          <div className="action">{this.getGroupAction(info.uuid)}</div>
        </div>
      );
    }
  }
}

export default connect(
  (state: TRPGState) => ({
    selfUUID: state.user.info.uuid!,
    friendList: state.user.friendList,
    friendInvite: state.user.friendInvite,
    friendRequests: state.user.friendRequests,
    joinedGroupUUIDs: state.group.groups.map((g) => g.uuid),
    requestingGroupUUID: state.group.requestingGroupUUID,
  }),
  (dispatch: TRPGDispatch) => ({
    sendFriendInvite: (uuid: string) => {
      dispatch(sendFriendInvite(uuid));
    },
    agreeFriendInvite: (fromUUID: string) => {
      dispatch((dispatch, getState) => {
        const friendRequests = getState().user.friendRequests;

        let inviteUUID = '';
        for (const req of friendRequests) {
          if (req.from_uuid === fromUUID) {
            inviteUUID = req.uuid;
            break;
          }
        }

        if (!!inviteUUID) {
          dispatch(agreeFriendInvite(inviteUUID));
        }
      });
    },
    requestJoinGroup: (uuid: string) => dispatch(requestJoinGroup(uuid)),
    showModal: (body) => dispatch(showModal(body)),
  })
)(FindResultItem);
