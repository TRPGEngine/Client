import React from 'react';
import { connect } from 'react-redux';
import config from '../../shared/project.config';
import ImageViewer from './ImageViewer';
import ImageUploader from './ImageUploader';
import { showAlert, hideProfileCard } from '../../shared/redux/actions/ui';
import { sendFriendInvite, updateInfo } from '../../shared/redux/actions/user';
import {
  addUserConverse,
  switchToConverse,
} from '../../shared/redux/actions/chat';
import './ProfileCard.scss';
import { TRPGState, TRPGDispatch } from '@redux/types/__all__';
import { AlertPayload } from '@redux/types/ui';
import { getUserName } from '@shared/utils/data-helper';
import { UserInfo } from '@redux/types/user';
import { Select } from 'antd';

interface Props {
  userInfo?: UserInfo;
  friendList: any[];
  isSelf: boolean;
  selectedUUID: string;
  isShow: boolean;
  showAlert: (payload: AlertPayload) => void;
  hideProfileCard: () => void;
  updateInfo: (data: {}) => void;
  addUserConverse: (uuid: string) => void;
  sendFriendInvite: (uuid: string) => void;
}
interface State {
  isEdited: boolean;
  editedInfo: { [name: string]: any };
}
class ProfileCard extends React.Component<Props, State> {
  state: State = {
    isEdited: false,
    editedInfo: {},
  };

  handleEditProfile() {
    if (this.props.isSelf) {
      this.setState({ isEdited: true });
      this.setEditedInfo();
    } else {
      this.props.showAlert('不是本人无法修改信息');
    }
  }

  handleClose() {
    this.setState({ isEdited: false });
    this.props.hideProfileCard();
  }

  handleReset() {
    console.log('重置');
    this.setEditedInfo();
  }

  handleSave() {
    console.log('保存修改', this.state.editedInfo);
    this.props.updateInfo(this.state.editedInfo);
    this.setState({ isEdited: false });
  }

  handleUpdateAvatar(avatarUrl) {
    this.props.updateInfo({ avatar: avatarUrl });
  }

  checkEditedIsChange() {
    const info = this.props.userInfo;
    if (JSON.stringify(this.state.editedInfo) === JSON.stringify(info)) {
      return false;
    } else {
      return true;
    }
  }

  setEditedInfo() {
    const info = this.props.userInfo;
    this.setState({ editedInfo: info ?? {} });
  }

  getActions() {
    const friendList = this.props.friendList;
    const disabledAddFriend =
      friendList.indexOf(this.props.selectedUUID) >= 0 || this.props.isSelf;
    const uuid = this.props.selectedUUID;
    console.log(uuid);
    if (this.state.isEdited) {
      const isChanged = this.checkEditedIsChange();
      return (
        <div className="actions">
          <button
            className="footer-item active"
            onClick={() => this.handleReset()}
            disabled={!isChanged}
          >
            <i className="iconfont">&#xe67c;</i>重置
          </button>
          <button
            className="footer-item active"
            onClick={() => this.handleSave()}
            disabled={!isChanged}
          >
            <i className="iconfont">&#xe634;</i>保存
          </button>
        </div>
      );
    } else {
      return (
        <div className="actions">
          <button
            className="footer-item active"
            onClick={() => this.props.addUserConverse(uuid)}
          >
            <i className="iconfont">&#xe61f;</i>发消息
          </button>
          <button
            className="footer-item active"
            disabled={disabledAddFriend}
            onClick={() => this.props.sendFriendInvite(uuid)}
          >
            <i className="iconfont">&#xe604;</i>添加好友
          </button>
        </div>
      );
    }
  }

  getSexP(sex) {
    if (sex === '男') {
      return (
        <span>
          <i className="iconfont">&#xe698;</i>男
        </span>
      );
    } else if (sex === '女') {
      return (
        <span>
          <i className="iconfont">&#xe64a;</i>女
        </span>
      );
    } else if (sex === '其他') {
      return (
        <span>
          <i className="iconfont">&#xe727;</i>其他
        </span>
      );
    } else {
      return (
        <span>
          <i className="iconfont">&#xe617;</i>保密
        </span>
      );
    }
  }

  getBody() {
    const isShow = this.props.isShow;
    if (isShow) {
      const isSelf = this.props.isSelf;
      const editBtn = this.state.isEdited ? (
        <button
          className="action"
          onClick={() => this.setState({ isEdited: false })}
        >
          <i className="iconfont">&#xe602;</i>取消编辑
        </button>
      ) : (
        <button className="action" onClick={() => this.handleEditProfile()}>
          <i className="iconfont">&#xe602;</i>编辑资料
        </button>
      );

      const bodyContent = this.state.isEdited ? (
        <div className="body">
          <div className="item">
            <span>唯一标识符:</span>
            <span>{this.props.userInfo?.uuid}</span>
          </div>
          <div className="item">
            <span>用户名:</span>
            <span>{this.props.userInfo?.username}</span>
          </div>
          <div className="item">
            <span>昵称:</span>
            <input
              value={this.state.editedInfo.nickname || ''}
              onChange={(e) =>
                this.setState({
                  editedInfo: {
                    ...this.state.editedInfo,
                    nickname: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="item">
            <span>性别:</span>
            <Select
              className="sex-select"
              value={this.state.editedInfo.sex}
              allowClear={false}
              placeholder="请选择性别..."
              onChange={(value) =>
                this.setState({
                  editedInfo: {
                    ...this.state.editedInfo,
                    sex: value,
                  },
                })
              }
            >
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
              <Select.Option value="保密">保密</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </div>
          <div className="item">
            <span>个人签名:</span>
            <textarea
              rows={3}
              value={this.state.editedInfo.sign || ''}
              onChange={(e) =>
                this.setState({
                  editedInfo: {
                    ...this.state.editedInfo,
                    sign: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      ) : (
        <div className="body">
          <div className="item">
            <span>唯一标识符:</span>
            <span>{this.props.userInfo?.uuid}</span>
          </div>
          {isSelf ? (
            <div className="item">
              <span>用户名:</span>
              {this.props.userInfo?.username}
            </div>
          ) : null}
          <div className="item">
            <span>昵称:</span>
            {this.props.userInfo?.nickname}
          </div>
          <div className="item">
            <span>性别:</span>
            {this.getSexP(this.props.userInfo?.sex)}
          </div>
          <div className="item">
            <span>个人签名:</span>
            <span>{this.props.userInfo?.sign}</span>
          </div>
        </div>
      );

      const avatar = this.props.userInfo?.avatar || '';
      const name = getUserName(this.props.userInfo);

      return (
        <div className="mask" onClick={(e) => e.stopPropagation()}>
          <div className="card">
            <div className="header">
              <div className="profile">
                <div className="avatar">
                  {isSelf ? (
                    <ImageUploader
                      width="57"
                      height="57"
                      type="user"
                      attachUUID={this.props.selectedUUID}
                      onUploadSuccess={(json) =>
                        this.handleUpdateAvatar(json.url)
                      }
                    >
                      <img src={avatar || config.defaultImg.getUser(name)} />
                    </ImageUploader>
                  ) : (
                    <ImageViewer
                      originImageUrl={avatar.replace('/thumbnail', '')}
                    >
                      <img src={avatar || config.defaultImg.getUser(name)} />
                    </ImageViewer>
                  )}
                </div>
                <span className="username">
                  {getUserName(this.props.userInfo)}
                </span>
                {isSelf ? editBtn : null}
              </div>
              <div className="close" onClick={() => this.handleClose()}>
                <i className="iconfont">&#xe70c;</i>
              </div>
            </div>
            {bodyContent}
            <div className="footer">{this.getActions()}</div>
          </div>
        </div>
      );
    }
  }

  render() {
    return <div className="profile-card">{this.getBody()}</div>;
  }
}

export default connect(
  (state: TRPGState) => {
    const selfUUID = state.user.info.uuid;
    const selectedUUID = state.ui.showProfileCardUUID;
    const isSelf = selfUUID === selectedUUID;
    const userInfo = isSelf ? state.user.info : state.cache.user[selectedUUID];

    return {
      userInfo,
      friendList: state.user.friendList,
      isSelf,
      selectedUUID,
      isShow: state.ui.showProfileCard,
    };
  },
  (dispatch: TRPGDispatch) => ({
    showAlert: (payload: AlertPayload) => dispatch(showAlert(payload)),
    hideProfileCard: () => dispatch(hideProfileCard()),
    addUserConverse: (uuid: string) => {
      dispatch(addUserConverse([uuid]));
      dispatch(switchToConverse(uuid));
    },
    // createConverse: (uuid, type, isSwitchToConv = true) => dispatch(createConverse(uuid, type, isSwitchToConv)),
    sendFriendInvite: (uuid: string) => dispatch(sendFriendInvite(uuid)),
    updateInfo: (updatedData: {}) => dispatch(updateInfo(updatedData)),
  })
)(ProfileCard);
