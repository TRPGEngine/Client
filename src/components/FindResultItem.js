const React = require('react');
const { connect } = require('react-redux');
const { addFriend } = require('../redux/actions/user');

require('./FindResultItem.scss');

class FindResultItem extends React.Component {
  _handleAddFriend(uuid) {
    console.log("add friend:", uuid);
    this.props.dispatch(addFriend(uuid));
  }

  getAction(uuid) {
    let friendList = this.props.friendList.toJS();
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
    }else {
      return (
        <button onClick={() => this._handleAddFriend(uuid)}>
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
          <img src={info.avatar || '/src/assets/img/gugugu1.png'} />
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
    friendList: state.getIn(['user', 'friendList'])
  })
)(FindResultItem);
