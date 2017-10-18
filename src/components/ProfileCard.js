const React = require('react');
const PropTypes = require('prop-types');
const { connect } = require('react-redux');
const { hideProfileCard } = require('../redux/actions/ui');
const { addFriend } = require('../redux/actions/user');
require('./ProfileCard.scss');

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdited: false,
    }
  }

  getActions() {
    let friendList = this.props.friendList.toJS();
    let selfUUID = this.props.selfUUID;
    let uuid = this.props.selectedUUID;
    let disabledAddFriend = friendList.indexOf(uuid)>=0 || uuid===selfUUID;
    if(this.state.isEdited) {
      return (
        <div className="actions">
          <div
            className="footer-item"
            onClick={() => console.log('reset')}
          ><i className="iconfont">&#xe67c;</i>重置</div>
          <div
            className={"footer-item" + (disabledAddFriend?" disabled":"")}
            onClick={() => console.log('save')}
          ><i className="iconfont">&#xe634;</i>保存</div>
        </div>
      )
    } else {
      return (
        <div className="actions">
          <div
            className="footer-item"
            onClick={() => this.props.dispatch(createConverse(uuid, 'user'))}
          ><i className="iconfont">&#xe61f;</i>发消息</div>
          <div
            className={"footer-item" + (disabledAddFriend?" disabled":"")}
            onClick={() => {if(!disabledAddFriend) {this.props.dispatch(addFriend(uuid))} }}
          ><i className="iconfont">&#xe604;</i>添加好友</div>
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
          onClick={() => this.setState({isEdited: true})}
        >
          <i className="iconfont">&#xe602;</i>编辑资料
        </button>
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
            <div className="body">
              <div className="item">
                <span>唯一标识符:</span><span>{this.props.usercache.getIn([uuid, 'uuid'])}</span>
              </div>
              <div className="item">
                <span>性别:</span>
                {this.getSexP(info.get('sex'))}
              </div>
              <div className="item">
                <span>个人签名:</span><span>{this.props.usercache.getIn([uuid, 'sign'])}</span>
              </div>
            </div>
            <div className="footer">
              {this.getActions()}
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
