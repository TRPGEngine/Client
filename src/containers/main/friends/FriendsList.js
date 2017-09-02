const React = require('react');
const { connect } = require('react-redux');
const { showInfoCard } = require('../../../redux/actions/ui');

const FriendsDetail = require('./FriendsDetail');

require('./FriendsList.scss');

class FriendsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRequest: '',
    }
  }

  _handleClick(uuid) {
    this.props.dispatch(showInfoCard(uuid));
  }

  getFriendList() {
    let friends = this.props.friends.toJS();
    let usercache = this.props.usercache;
    return friends.length > 0 ? friends.map((item, index) => {
      let uuid = item;
      return (
        <div key={uuid + index} className="item">
          <div className="item-wrap" onClick={() => this._handleClick(uuid)}>
            <div className="avatar"><img src={usercache.getIn([uuid, 'avatar']) || '/src/assets/img/gugugu1.png'} /></div>
            <div className="username">{usercache.getIn([uuid, 'username'])}</div>
          </div>
        </div>
      )
    }) : (
      <div className="no-friend">暂无好友哦</div>
    )
  }

  getFriendRequest() {
    let friendRequests = this.props.friendRequests.toJS();
    friendRequests = [{
      "username":"admin2",
      "uuid":"d53fde10-8fd8-11e7-8a56-530562e6d304",
      "selected_actor":2,
      "last_login":null,
      "id":2,
      "avatar":null,
      "token":""
    }]; // demo data

    let selectRequest = this.state.selectRequest;
    return friendRequests.map((item, index) => {
      return (
        <div
          key={item.uuid + "#" + index}
          className={"request-item" + (item.uuid===selectRequest?" active":"")}
        >
          <div
            className="request-profile"
            onClick={() => {
              if(selectRequest === item.uuid) {
                this.setState({selectRequest: ""})
              }else {
                this.setState({selectRequest: item.uuid})
              }
            }}
          >
            <div className="avatar" onClick={() => this.props.dispatch(showInfoCard(item.uuid))}>
              <img src={item.avatar || "/src/assets/img/gugugu1.png"} />
            </div>
            <div className="text">{item.username}{item.username} 请求添加你为好友</div>
          </div>
          <div className="request-action">
            <div onClick={() => console.log("refuse")}>拒绝</div>
            <div onClick={() => console.log("agree")}>同意</div>
          </div>
        </div>
      )
    });
  }

  render() {
    return (
      <div className="friends">
        <div className="list">
          {/*<div className="add-note" data-tip="添加笔记" onClick={() => this.props.dispatch(addNote())}>
            <ReactTooltip effect='solid'/>
            <i className="iconfont">&#xe604;</i>
          </div>*/}
          <div className="items">
            {this.getFriendList()}
          </div>
          <div className="requests">
            {this.getFriendRequest()}
          </div>
        </div>
        <div className="detail">
          <FriendsDetail />
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    friends: state.getIn(['user', 'friendList']),
    friendRequests: state.getIn(['user', 'friendRequests']),
    usercache: state.getIn(['cache', 'user']),
  })
)(FriendsList);
