const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../config/project.config.js');
const dateHelper = require('../../../utils/dateHelper');
const MsgSendBox = require('../../../components/MsgSendBox');
const MsgItem = require('../../../components/MsgItem');
const scrollTo = require('../../../utils/animatedScrollTo.js');
const ReactTooltip = require('react-tooltip');
const { showModal, hideModal } = require('../../../redux/actions/ui');
const { sendMsg, getMoreChatLog } = require('../../../redux/actions/chat');
const { sendDiceRequest } = require('../../../redux/actions/dice');
const DiceRequest = require('../dice/DiceRequest');

require('./ConverseDetail.scss');

class ConverseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nomore: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.msgList.size === 0 || nextProps.msgList.size === this.props.msgList.size) {
      this.setState({nomore: true});
    }else {
      this.setState({nomore: false});
    }
  }

  componentDidMount() {
    let container = this.refs.container;
    scrollTo.bottom(container, 400);

    if(this.props.msgList.size === 0) {
      this.setState({nomore: true});
    }else {
      this.setState({nomore: false});
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.props.nextState && this.props.nextState.size > 0 && nextProps.msgList.last().get('date') !== this.props.msgList.last().get('date')) {
      let container = this.refs.container;
      setTimeout(function() {
        scrollTo.bottom(container, 100);
      }, 0);
    }
  }

  _handleSendMsg(message, type) {
    console.log('send msg:', message, 'to', this.props.converseUUID);
    this.props.dispatch(sendMsg(this.props.converseUUID ,{
      message,
      is_public: false,
      type,
    }));
  }

  _handleSendDiceInv() {
    // TODO
    console.log("发送投骰邀请");
  }

  _handleGetMoreLog() {
    let date = this.props.msgList.first().get('date');
    let { userUUID, converseUUID } = this.props;
    this.props.dispatch(getMoreChatLog(userUUID, converseUUID, date));
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

  getMsgList(list) {
    if(!!list) {
      let userUUID = this.props.userUUID;
      let usercache = this.props.usercache;
      return (
        <div className="msg-items">
        {
          list.map((item, index) => {
            let defaultAvatar = item.get('sender_uuid') === 'trpgsystem' ? config.defaultImg.trpgsystem : config.defaultImg.user;
            let data = item.get('data');
            let isMe = userUUID===item.get('sender_uuid');
            let icon = isMe ? this.props.selfInfo.get('avatar') : usercache.getIn([item.get('sender_uuid'), 'avatar'])
            let name = isMe ? this.props.selfInfo.get('nickname') || this.props.selfInfo.get('username') : usercache.getIn([item.get('sender_uuid'), 'username'])

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
      )
    }else {
      return (
        <div className="msg-items">
          {/*暂无消息*/}
        </div>
      )
    }
  }

  render() {
    let list = this.props.list;
    // if(!!list) {
    //   list = list.toJS();
    // }
    return (
      <div className="conv-detail">
        <div className="conv-container" ref="container">
          {
            this.state.nomore ? (
              <button className="get-more-log-btn" disabled={true}>没有更多记录了</button>
            ) : (
              <button className="get-more-log-btn" onClick={() => this._handleGetMoreLog()}>点击获取更多记录</button>
            )
          }
          {this.getMsgList(this.props.msgList)}
        </div>
        <MsgSendBox
          conversesUUID={this.props.conversesUUID}
          isGroup={false}
          onSendMsg={(message, type) => this._handleSendMsg(message, type)}
          onSendDiceInv={() => this._handleSendDiceInv()}
        />
      </div>
    )
  }
}

module.exports = connect(
  state => {
    let conversesUUID = state.getIn(['chat', 'selectedConversesUUID']);
    return {
      userUUID: state.getIn(['user','info','uuid']),
      selfInfo: state.getIn(['user', 'info']),
      usercache: state.getIn(['cache', 'user']),
      conversesUUID,
      msgList: state.getIn(['chat', 'converses', conversesUUID, 'msgList']).sortBy((item) => item.get('date')),
      friendRequests: state.getIn(['user', 'friendRequests']),
      friendList: state.getIn(['user', 'friendList']),
      groupInvites: state.getIn(['group', 'invites']),
      groupUUIDList: state.getIn(['group', 'groups']).map((item) => item.get('uuid')),
    }
  }
)(ConverseDetail);
