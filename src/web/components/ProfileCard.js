import React from 'react';
import { connect } from 'react-redux';
import config from '../../shared/project.config';
import Select from 'react-select';
import ImageViewer from './ImageViewer';
import ImageUploader from './ImageUploader';
import { showAlert, hideProfileCard } from '../../shared/redux/actions/ui';
import { sendFriendInvite, updateInfo } from '../../shared/redux/actions/user';
import { addUserConverse, switchToConverse } from '../../shared/redux/actions/chat';
import './ProfileCard.scss';

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdited: false,
      editedInfo: {},
    };
  }

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
    let info = this.props.userInfo;
    if (JSON.stringify(this.state.editedInfo) === JSON.stringify(info)) {
      return false;
    } else {
      return true;
    }
  }

  setEditedInfo() {
    let info = this.props.userInfo;
    this.setState({ editedInfo: info ? info.toJS() : {} });
  }

  getActions() {
    let friendList = this.props.friendList.toJS();
    let disabledAddFriend =
      friendList.indexOf(this.props.selectedUUID) >= 0 || this.props.isSelf;
    let uuid = this.props.selectedUUID;
    console.log(uuid);
    if (this.state.isEdited) {
      let isChanged = this.checkEditedIsChange();
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
    let isShow = this.props.isShow;
    if (isShow) {
      let isSelf = this.props.isSelf;
      let editBtn = this.state.isEdited ? (
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

      let bodyContent = this.state.isEdited ? (
        <div className="body">
          <div className="item">
            <span>唯一标识符:</span>
            <span>{this.props.userInfo.get('uuid')}</span>
          </div>
          <div className="item">
            <span>用户名:</span>
            <span>{this.props.userInfo.get('username')}</span>
          </div>
          <div className="item">
            <span>昵称:</span>
            <input
              value={this.state.editedInfo.nickname || ''}
              onChange={(e) =>
                this.setState({
                  editedInfo: Object.assign(this.state.editedInfo, {
                    nickname: e.target.value,
                  }),
                })
              }
            />
          </div>
          <div className="item">
            <span>性别:</span>
            <Select
              name="sex-select"
              className="sex-select"
              value={this.state.editedInfo.sex}
              options={[
                { value: '男', label: '男' },
                { value: '女', label: '女' },
                { value: '保密', label: '保密' },
                { value: '其他', label: '其他' },
              ]}
              clearable={false}
              searchable={false}
              placeholder="请选择性别..."
              onChange={(item) =>
                this.setState({
                  editedInfo: Object.assign(this.state.editedInfo, {
                    sex: item.value,
                  }),
                })
              }
            />
          </div>
          <div className="item">
            <span>个人签名:</span>
            <textarea
              rows="3"
              value={this.state.editedInfo.sign || ''}
              onChange={(e) =>
                this.setState({
                  editedInfo: Object.assign(this.state.editedInfo, {
                    sign: e.target.value,
                  }),
                })
              }
            />
          </div>
        </div>
      ) : (
        <div className="body">
          <div className="item">
            <span>唯一标识符:</span>
            <span>{this.props.userInfo.get('uuid')}</span>
          </div>
          {isSelf ? (
            <div className="item">
              <span>用户名:</span>
              {this.props.userInfo.get('username')}
            </div>
          ) : null}
          <div className="item">
            <span>昵称:</span>
            {this.props.userInfo.get('nickname')}
          </div>
          <div className="item">
            <span>性别:</span>
            {this.getSexP(this.props.userInfo.get('sex'))}
          </div>
          <div className="item">
            <span>个人签名:</span>
            <span>{this.props.userInfo.get('sign')}</span>
          </div>
        </div>
      );

      let avatar = this.props.userInfo.get('avatar') || '';
      let name =
        this.props.userInfo.get('nickname') ||
        this.props.userInfo.get('username');

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
                  {this.props.userInfo.get('nickname') ||
                    this.props.userInfo.get('username')}
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
  (state) => {
    let selfUUID = state.getIn(['user', 'info', 'uuid']);
    let selectedUUID = state.getIn(['ui', 'showProfileCardUUID']);
    let isSelf = selfUUID === selectedUUID;
    let userInfo = isSelf
      ? state.getIn(['user', 'info'])
      : state.getIn(['cache', 'user', selectedUUID]);

    return {
      userInfo,
      friendList: state.getIn(['user', 'friendList']),
      isSelf,
      selectedUUID,
      isShow: state.getIn(['ui', 'showProfileCard']),
    };
  },
  (dispatch) => ({
    showAlert: (...args) => dispatch(showAlert(...args)),
    hideProfileCard: () => dispatch(hideProfileCard()),
    addUserConverse: (uuid) => {
      dispatch(addUserConverse(uuid));
      dispatch(switchToConverse(uuid));
    },
    // createConverse: (uuid, type, isSwitchToConv = true) => dispatch(createConverse(uuid, type, isSwitchToConv)),
    sendFriendInvite: (uuid) => dispatch(sendFriendInvite(uuid)),
    updateInfo: (updatedData) => dispatch(updateInfo(updatedData)),
  })
)(ProfileCard);
