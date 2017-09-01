const React = require('react');
const { connect } = require('react-redux');
const { showInfoCard } = require('../../../redux/actions/ui');

const FriendsDetail = require('./FriendsDetail');

require('./FriendsList.scss');

class FriendsList extends React.Component {
  _handleClick(uuid) {
    this.props.dispatch(showInfoCard(uuid));
  }

  getFriendList() {
    let friends = this.props.friends;
    let usercache = this.props.usercache;
    return friends.length > 0 ? friends.map((item, index) => {
      console.log('friends item', item);
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
    usercache: state.getIn(['cache', 'user']),
  })
)(FriendsList);
