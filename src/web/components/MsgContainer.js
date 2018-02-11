const React = require('react');
const { connect } = require('react-redux');
const MsgItem = require('./MsgItem');
const config = require('../../../config/project.config.js');
const dateHelper = require('../../utils/dateHelper');
const scrollTo = require('../../utils/animatedScrollTo.js');
const { getMoreChatLog } = require('../../redux/actions/chat')

class MsgContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nomore: false,
    }
  }

  componentDidMount() {
    scrollTo.bottom(this.refs.container, 400);

    if(this.props.msgList.size === 0) {
      this.setState({nomore: true});
    }else {
      this.setState({nomore: false});
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.msgList.size === 0 || nextProps.msgList.size === this.props.msgList.size) {
      this.setState({nomore: true});
    }else {
      this.setState({nomore: false});
    }

    if(nextProps.msgList.size === 0 || this.props.msgList.size === 0 || nextProps.msgList.last().get('date') !== this.props.msgList.last().get('date')) {
      setTimeout(() => {
        scrollTo.bottom(this.refs.container, 100);
      }, 0);
    }
  }

  _handleGetMoreLog() {
    let date = this.props.msgList.first().get('date');
    let { converseUUID } = this.props;
    this.props.dispatch(getMoreChatLog(converseUUID, date, !this.props.isGroup));
  }

  prepareMsgItemCardData(data) {
    if(data.get('type') === 'friendInvite') {
      let inviteUUID = data.getIn(['invite', 'uuid']);
      let from_uuid = data.getIn(['invite', 'from_uuid']);
      let inviteIndex = this.props.friendRequests.findIndex((item) => {
        if(item.get('uuid') === inviteUUID) {
          return true
        }else {
          return false
        }
      });
      if(inviteIndex >= 0) {
        // 尚未处理
        data = data.set('actionState', 0);
      }else {
        let friendIndex = this.props.friendList.indexOf(from_uuid);
        if(friendIndex >= 0) {
          // 已同意是好友
          data = data.set('actionState', 1);
        }else {
          // 已拒绝好友邀请
          data = data.set('actionState', 2);
        }
      }
    }else if(data.get('type') === 'groupInvite') {
      let inviteUUID = data.getIn(['invite', 'uuid']);
      let group_uuid = data.getIn(['invite', 'group_uuid']);
      let inviteIndex = this.props.groupInvites.findIndex((item) => {
        if(item.get('uuid') === inviteUUID) {
          return true
        }else {
          return false
        }
      });
      if(inviteIndex >= 0) {
        // 尚未处理
        data = data.set('actionState', 0);
      }else {
        let friendIndex = this.props.groupUUIDList.indexOf(group_uuid);
        if(friendIndex >= 0) {
          // 已同意是邀请
          data = data.set('actionState', 1);
        }else {
          // 已拒绝邀请
          data = data.set('actionState', 2);
        }
      }
    }

    return data;
  }

  render() {
    let { userUUID, usercache } = this.props;

    return (
      <div className={"msg-container " + this.props.className} ref="container">
        {
          this.state.nomore || this.props.msgList.size < 10 ? (
            <button className="get-more-log-btn" disabled={true}>没有更多记录了</button>
          ) : (
            <button className="get-more-log-btn" onClick={() => this._handleGetMoreLog()}>点击获取更多记录</button>
          )
        }
        <div className="msg-items">
          {
            this.props.msgList.map((item, index) => {
              let defaultAvatar = item.get('sender_uuid') === 'trpgsystem' ? config.defaultImg.trpgsystem : config.defaultImg.user;
              let data = item.get('data');
              let isMe = userUUID===item.get('sender_uuid');
              let icon = isMe ? this.props.selfInfo.get('avatar') : usercache.getIn([item.get('sender_uuid'), 'avatar'])
              let name = isMe
                ? this.props.selfInfo.get('nickname') || this.props.selfInfo.get('username')
                : usercache.getIn([item.get('sender_uuid'), 'nickname']) || usercache.getIn([item.get('sender_uuid'), 'username']);

              // data 预处理
              if(data && item.get('type') === 'card') {
                data = this.prepareMsgItemCardData(data);
              }

              return (
                <MsgItem
                  key={item.get('uuid')+'+'+index}
                  uuid={item.get('uuid')}
                  icon={icon || defaultAvatar}
                  name={name || ''}
                  type={item.get('type')}
                  content={item.get('message')}
                  data={data}
                  time={dateHelper.getMsgDate(item.get('date'))}
                  me={isMe}
                  isGroupMsg={false}
                />
              )
            })
          }
        </div>
      </div>
    )
  }
}

module.exports = connect(
  (state, ownProps) => {
    let converseUUID = ownProps.converseUUID;
    let msgList = state.getIn(['chat', 'converses', converseUUID, 'msgList']);

    return {
      msgList: msgList && msgList.sortBy((item) => item.get('date')),
      userUUID: state.getIn(['user','info','uuid']),
      selfInfo: state.getIn(['user', 'info']),
      usercache: state.getIn(['cache', 'user']),
      friendRequests: state.getIn(['user', 'friendRequests']),
      friendList: state.getIn(['user', 'friendList']),
      groupInvites: state.getIn(['group', 'invites']),
      groupUUIDList: state.getIn(['group', 'groups']).map((item) => item.get('uuid')),
    }
  }
)(MsgContainer);
