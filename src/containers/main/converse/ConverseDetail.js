const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../../config/project.config.js');
const dateHelper = require('../../../utils/dateHelper');
const MsgSendBox = require('../../../components/MsgSendBox');
const MsgItem = require('../../../components/MsgItem');
const scrollTo = require('../../../utils/animatedScrollTo.js');
const ReactTooltip = require('react-tooltip');
const { showModal, hideModal } = require('../../../redux/actions/ui');
const { sendMsg } = require('../../../redux/actions/chat');
const { sendDiceRequest } = require('../../../redux/actions/dice');
const DiceRequest = require('../dice/DiceRequest');

require('./ConverseDetail.scss');

class ConverseDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let container = this.refs.container;
    scrollTo.bottom(container, 400);
  }

  componentDidUpdate() {
    let container = this.refs.container;
    scrollTo.bottom(container, 400, false);
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
          list.sortBy((item) => item.get('date')).map((item, index) => {
            let defaultAvatar = item.get('sender_uuid') === 'trpgsystem' ? config.defaultImg.trpgsystem : config.defaultImg.user;
            let data = item.get('data');

            // data 预处理
            if(data && item.get('type') === 'card') {
              data = this.prepareMsgItemCardData(data);
            }

            return (
              <MsgItem
                key={item.get('uuid')+'+'+index}
                uuid={item.get('uuid')}
                icon={usercache.getIn([item.sender_uuid, 'avatar']) || defaultAvatar}
                name={usercache.getIn([item.sender_uuid, 'username']) || ''}
                type={item.get('type')}
                content={item.get('message')}
                data={data}
                time={dateHelper.getMsgDate(item.get('date'))}
                me={userUUID===item.get('sender_uuid')}
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
          {this.getMsgList(list)}
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
  state => ({
    userUUID: state.getIn(['user','info','uuid']),
    usercache: state.getIn(['cache', 'user']),
    conversesUUID: state.getIn(['chat', 'selectedConversesUUID']),
    friendRequests: state.getIn(['user', 'friendRequests']),
    friendList: state.getIn(['user', 'friendList']),
    groupInvites: state.getIn(['group', 'invites']),
    groupUUIDList: state.getIn(['group', 'groups']).map((item) => item.get('uuid')),
  })
)(ConverseDetail);
