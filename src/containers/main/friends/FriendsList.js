const React = require('react');
const { connect } = require('react-redux');
const { showInfoCard } = require('../../../redux/actions/ui');
const { agreeFriendInvite, refuseFriendInvite } = require('../../../redux/actions/user');
const ConvItem = require('../../../components/ConvItem');

const FriendsDetail = require('./FriendsDetail');

require('./FriendsList.scss');

class FriendsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRequest: '',
    }
  }

  getFriendList() {
    let friends = this.props.friends.toJS();
    let usercache = this.props.usercache;
    return friends.length > 0 ? friends.map((item, index) => {
      let uuid = item;
      // return (
      //   <div key={uuid + index} className="item">
      //     <div className="item-wrap" onClick={() => this.props.showInfoCard(uuid)}>
      //       <div className="avatar"><img src={usercache.getIn([uuid, 'avatar']) || '/src/assets/img/gugugu1.png'} /></div>
      //       <div className="username">{usercache.getIn([uuid, 'username'])}</div>
      //     </div>
      //   </div>
      // )
      return (
        <ConvItem
          key={`friends#${uuid}#${index}`}
          icon={usercache.getIn([uuid, 'avatar']) || '/src/assets/img/gugugu1.png'}
          title={usercache.getIn([uuid, 'nickname']) || usercache.getIn([uuid, 'username'])}
          content={usercache.getIn([uuid, 'sign'])}
          time=''
          uuid=''
          isSelected={false}
          onClick={() => this.props.showInfoCard(uuid)}
          hideCloseBtn={true}
        />
      )
    }) : (
      <div className="no-friend">暂无好友哦</div>
    )
  }

  getFriendRequest() {
    // 弃用
    let friendRequests = this.props.friendRequests.toJS();
    let usercache = this.props.usercache;
    // friendRequests = [{
    //   "username":"admin2",
    //   "uuid":"d53fde10-8fd8-11e7-8a56-530562e6d304",
    //   "selected_actor":2,
    //   "last_login":null,
    //   "id":2,
    //   "avatar":null,
    //   "token":""
    // }]; // demo data

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
            <div className="avatar" onClick={() => this.props.showInfoCard(item.from_uuid)}>
              <img src={usercache.getIn([item.from_uuid, 'avatar']) || "/src/assets/img/gugugu1.png"} />
            </div>
            <div className="text">{usercache.getIn([item.from_uuid, 'username'])} 请求添加你为好友</div>
          </div>
          <div className="request-action">
            <div onClick={() => this.props.refuseFriendInvite(item.uuid)}>拒绝</div>
            <div onClick={() => this.props.agreeFriendInvite(item.uuid)}>同意</div>
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
          {/*<div className="requests">
            {this.getFriendRequest()}
          </div>*/}
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
  }),
  dispatch => ({
    showInfoCard: (uuid) => {
      dispatch(showInfoCard(uuid));
    },
    agreeFriendInvite: (inviteUUID) => {
      dispatch(agreeFriendInvite(inviteUUID));
    },
    refuseFriendInvite: (inviteUUID) => {
      dispatch(refuseFriendInvite(inviteUUID));
    },
  }),
)(FriendsList);
