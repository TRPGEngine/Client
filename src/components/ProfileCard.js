const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const Select = require('react-select');
const { hideProfileCard } = require('../redux/actions/ui');
const { addFriend } = require('../redux/actions/user');
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
    if(this.props.selfUUID === this.props.selectedUUID) {
      this.setState({isEdited: true});
      this.setEditedInfo();
    }else {
      console.error("不是本人无法修改信息");
    }
  }

  checkEditedIsChange() {
    let info = this.props.usercache.get(this.props.selectedUUID);
    console.log(JSON.stringify(this.state.editedInfo) === JSON.stringify(info));
    if(JSON.stringify(this.state.editedInfo) === JSON.stringify(info)) {
      return false;
    }else {
      return true;
    }
  }

  setEditedInfo() {
    let info = this.props.usercache.get(this.props.selectedUUID);
    this.setState({editedInfo: info ? info.toJS() : {}});
  }

  getActions() {
    let friendList = this.props.friendList.toJS();
    let selfUUID = this.props.selfUUID;
    let uuid = this.props.selectedUUID;
    let disabledAddFriend = friendList.indexOf(uuid)>=0 || uuid===selfUUID;
    if(this.state.isEdited) {
      let isChanged = this.checkEditedIsChange();
      return (
        <div className="actions">
          <button
            className="footer-item active"
            onClick={() => console.log('reset')}
            disabled={isChanged}
          ><i className="iconfont">&#xe67c;</i>重置</button>
          <button
            className="footer-item active"
            onClick={() => console.log('save')}
            disabled={!isChanged}
          ><i className="iconfont">&#xe634;</i>保存</button>
        </div>
      )
    } else {
      return (
        <div className="actions">
          <button
            className="footer-item active"
            onClick={() => this.props.dispatch(createConverse(uuid, 'user'))}
          ><i className="iconfont">&#xe61f;</i>发消息</button>
          <button
            className="footer-item active"
            disabled={disabledAddFriend}
            onClick={() => this.props.dispatch(addFriend(uuid))}
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
      let isSelf = this.props.selfUUID === this.props.selectedUUID;
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
            <span>唯一标识符:</span><span>{this.props.usercache.getIn([uuid, 'uuid'])}</span>
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
            {/*<input
              type="text"
              value={this.state.editedInfo.sign}
              onChange={(e) => this.setState({editedInfo: Object.assign(this.state.editedInfo, {sign: e.target.value})})}
            />*/}
            <textarea
              rows="3"
              value={this.state.editedInfo.sign}
              onChange={(e) => this.setState({
                editedInfo: Object.assign(this.state.editedInfo, {sign: e.target.value})
              })}
            />
          </div>
        </div>
      ) : (
        <div className="body">
          <div className="item">
            <span>唯一标识符:</span><span>{this.props.usercache.getIn([uuid, 'uuid'])}</span>
          </div>
          <div className="item">
            <span>性别:</span>
            { this.getSexP(this.props.usercache.getIn([uuid, 'sex'])) }
          </div>
          <div className="item">
            <span>个人签名:</span><span>{this.props.usercache.getIn([uuid, 'sign'])}</span>
          </div>
        </div>
      )

      return (
        <div className="mask">
          <div className="card">
            <div className="header">
              <div className="profile">
                <div className="avatar">
                  <img src={this.props.usercache.getIn([uuid, 'avatar']) || '/src/assets/img/gugugu1.png'} />
                </div>
                <span className="username">{this.props.usercache.getIn([uuid, 'nickname']) || this.props.usercache.getIn([uuid, 'username'])}</span>
                {
                  isSelf ? editBtn : null
                }
              </div>
              <div className="close" onClick={() => this.props.dispatch(hideProfileCard())}>
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

ProfileCard.propTypes = {
  uuid: PropTypes.string,
  show: PropTypes.bool,
}

module.exports = connect(
  state => ({
    usercache: state.getIn(['cache', 'user']),
    friendList: state.getIn(['user', 'friendList']),
    selfUUID: state.getIn(['user', 'info', 'uuid']),
    selectedUUID: state.getIn(['ui', 'showProfileCardUUID']),
    isShow: state.getIn(['ui', 'showProfileCard']),
  })
)(ProfileCard);
