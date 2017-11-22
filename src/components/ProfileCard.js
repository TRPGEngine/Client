const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const config = require('../../config/project.config.js');
const Select = require('react-select');
const ImageUploader = require('./ImageUploader');
const { showAlert, hideProfileCard } = require('../redux/actions/ui');
const { addFriend, updateInfo } = require('../redux/actions/user');
const { createConverse } = require('../redux/actions/chat');
require('./ProfileCard.scss');

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdited: false,
      editedInfo: {}
    }
  }

  _handleEditProfile() {
    if(this.props.isSelf) {
      this.setState({isEdited: true});
      this.setEditedInfo();
    }else {
      this.props.showAlert("不是本人无法修改信息");
    }
  }

  _handleClose() {
    this.setState({isEdited: false});
    this.props.hideProfileCard();
  }

  _handleReset() {
    console.log('重置');
    this.setEditedInfo();
  }

  _handleSave() {
    console.log('保存修改', this.state.editedInfo);
    this.props.updateInfo(this.state.editedInfo);
    this.setState({isEdited: false});
  }

  _handleUpdateAvatar(avatarUrl) {
    // TODO
    console.log('update avatar', avatarUrl);
  }

  checkEditedIsChange() {
    let info = this.props.userInfo;
    if(JSON.stringify(this.state.editedInfo) === JSON.stringify(info)) {
      return false;
    }else {
      return true;
    }
  }

  setEditedInfo() {
    let info = this.props.userInfo;
    this.setState({editedInfo: info ? info.toJS() : {}});
  }

  getActions() {
    let friendList = this.props.friendList.toJS();
    let disabledAddFriend = friendList.indexOf(this.props.selectedUUID)>=0 || this.props.isSelf;
    if(this.state.isEdited) {
      let isChanged = this.checkEditedIsChange();
      return (
        <div className="actions">
          <button
            className="footer-item active"
            onClick={() => this._handleReset()}
            disabled={!isChanged}
          ><i className="iconfont">&#xe67c;</i>重置</button>
          <button
            className="footer-item active"
            onClick={() => this._handleSave()}
            disabled={!isChanged}
          ><i className="iconfont">&#xe634;</i>保存</button>
        </div>
      )
    } else {
      return (
        <div className="actions">
          <button
            className="footer-item active"
            onClick={() => this.props.createConverse(uuid, 'user')}
          ><i className="iconfont">&#xe61f;</i>发消息</button>
          <button
            className="footer-item active"
            disabled={disabledAddFriend}
            onClick={() => this.props.addFriend(uuid)}
          ><i className="iconfont">&#xe604;</i>添加好友</button>
        </div>
      )
    }

  }

  getSexP(sex) {
    if(sex === '男') {
      return (
        <span>
          <i className="iconfont">&#xe698;</i>男
        </span>
      );
    }else if(sex === '女') {
      return (
        <span>
          <i className="iconfont">&#xe64a;</i>女
        </span>
      );
    }else if(sex === '其他') {
      return (
        <span>
          <i className="iconfont">&#xe727;</i>其他
        </span>
      );
    }else {
      return (
        <span>
          <i className="iconfont">&#xe617;</i>保密
        </span>
      );
    }
  }

  getBody() {
    let isShow = this.props.isShow;
    if(isShow) {
      let isSelf = this.props.isSelf;
      let uuid = this.props.selectedUUID;
      let editBtn = this.state.isEdited ? (
        <button
          className="action"
          onClick={() => this.setState({isEdited: false})}
        >
          <i className="iconfont">&#xe602;</i>取消编辑
        </button>
      ) : (
        <button
          className="action"
          onClick={() => this._handleEditProfile()}
        >
          <i className="iconfont">&#xe602;</i>编辑资料
        </button>
      )

      let bodyContent = this.state.isEdited ? (
        <div className="body">
          <div className="item">
            <span>唯一标识符:</span><span>{this.props.userInfo.get('uuid')}</span>
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
              onChange={(item) => this.setState({
                editedInfo: Object.assign(this.state.editedInfo, {sex: item.value})
              })}
            />
          </div>
          <div className="item">
            <span>个人签名:</span>
            <textarea
              rows="3"
              value={this.state.editedInfo.sign || ''}
              onChange={(e) => this.setState({
                editedInfo: Object.assign(this.state.editedInfo, {sign: e.target.value})
              })}
            />
          </div>
        </div>
      ) : (
        <div className="body">
          <div className="item">
            <span>唯一标识符:</span><span>{this.props.userInfo.get('uuid')}</span>
          </div>
          <div className="item">
            <span>性别:</span>
            { this.getSexP(this.props.userInfo.get('sex')) }
          </div>
          <div className="item">
            <span>个人签名:</span><span>{this.props.userInfo.get('sign')}</span>
          </div>
        </div>
      )

      return (
        <div className="mask" onClick={(e) => e.stopPropagation()}>
          <div className="card">
            <div className="header">
              <div className="profile">
                <div className="avatar">
                  {
                    isSelf ? (
                      <ImageUploader
                        width="57"
                        height="57"
                        type="user"
                        onUploadSuccess={(json) => this._handleUpdateAvatar(json.url)}
                      >
                        <img src={this.props.userInfo.get('avatar') || config.defaultImg.user} />
                      </ImageUploader>
                    ) : (
                      <img src={this.props.userInfo.get('avatar') || config.defaultImg.user} />
                    )
                  }
                </div>
                <span className="username">{this.props.userInfo.get('nickname') || this.props.userInfo.get('username')}</span>
                {
                  isSelf ? editBtn : null
                }
              </div>
              <div className="close" onClick={() => this._handleClose()}>
                <i className="iconfont">&#xe70c;</i>
              </div>
            </div>
            { bodyContent }
            <div className="footer">
              { this.getActions() }
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="profile-card">
        { this.getBody() }
      </div>
    )
  }
}

module.exports = connect(
  state => {
    let selfUUID = state.getIn(['user', 'info', 'uuid']);
    let selectedUUID = state.getIn(['ui', 'showProfileCardUUID']);
    let isSelf = selfUUID === selectedUUID;
    let userInfo = isSelf ? state.getIn(['user', 'info']) : state.getIn(['cache', 'user', selectedUUID]);

    return {
      userInfo,
      friendList: state.getIn(['user', 'friendList']),
      isSelf,
      selectedUUID,
      isShow: state.getIn(['ui', 'showProfileCard']),
    }
  },
  dispatch => ({
    showAlert: (...args) => dispatch(showAlert(...args)),
    hideProfileCard: () => dispatch(hideProfileCard()),
    createConverse: (uuid, type, isSwitchToConv = true) => dispatch(createConverse(uuid, type, isSwitchToConv)),
    addFriend: (uuid) => dispatch(addFriend(uuid)),
    updateInfo: (updatedData) => dispatch(updateInfo(updatedData)),
  }),
)(ProfileCard);
