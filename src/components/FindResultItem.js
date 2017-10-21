const React = require('react');
const { connect } = require('react-redux');
const config = require('../../config/project.config.js');
const { sendFriendInvite, agreeFriendInvite } = require('../redux/actions/user');

require('./FindResultItem.scss');

class FindResultItem extends React.Component {
  getAction(uuid) {
    let friendList = this.props.friendList.toJS();
    let friendInvite = this.props.friendInvite.toJS();
    let friendRequests = this.props.friendRequests.toArray().map((item) => {
      return item.get('from_uuid');
    });
    let selfUUID = this.props.selfUUID;
    if(selfUUID === uuid) {
      return (
        <button disabled>
          <i className="iconfont">&#xe607;</i>我自己
        </button>
      )
    }else if(friendList.indexOf(uuid) >= 0){
      return (
        <button disabled>
          <i className="iconfont">&#xe604;</i>已添加
        </button>
      )
    }else if(friendInvite.indexOf(uuid) >= 0){
      return (
        <button disabled>
          <i className="iconfont">&#xe62e;</i>已邀请
        </button>
      )
    }else if(friendRequests.indexOf(uuid) >= 0){
      return (
        <button onClick={() => this.props.agreeFriendInvite(uuid)}>
          <i className="iconfont">&#xe67d;</i>同意
        </button>
      )
    }else {
      return (
        <button onClick={() => this.props.sendFriendInvite(uuid)}>
          <i className="iconfont">&#xe604;</i>添加好友
        </button>
      )
    }
  }

  render() {
    let info = this.props.info;

    return (
      <div className="find-result-item">
        <div className="avatar">
          <img src={info.avatar || config.defaultImg.user} />
        </div>
        <div className="profile">
          <span className="username">{info.nickname || info.username}</span>
          <span className="uuid">{info.uuid}</span>
        </div>
        <div className="action">
          {this.getAction(info.uuid)}
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    selfUUID: state.getIn(['user', 'info', 'uuid']),
    friendList: state.getIn(['user', 'friendList']),
    friendInvite: state.getIn(['user', 'friendInvite']),
    friendRequests: state.getIn(['user', 'friendRequests']),
  }),
  dispatch => ({
    sendFriendInvite: (uuid) => {
      dispatch(sendFriendInvite(uuid));
    },
    agreeFriendInvite: (fromUUID) => {
      dispatch((dispatch, getState) => {
        let friendRequests = getState().getIn(['user', 'friendRequests']).toJS();

        let inviteUUID = '';
        for (let req of friendRequests) {
          if(req.from_uuid === fromUUID) {
            inviteUUID = req.uuid;
            break;
          }
        }

        if(!!inviteUUID) {
          dispatch(agreeFriendInvite(inviteUUID));
        }
      })
    }
  })
)(FindResultItem);
