const React = require('react');
const { connect } = require('react-redux');
const config = require('../../../config/project.config.js');
const dateHelper = require('../../shared/utils/dateHelper');
const scrollTo = require('../../shared/utils/animatedScrollTo.js');
const { getMoreChatLog } = require('../../redux/actions/chat')

const MessageHandler = require('../../shared/components/MessageHandler');
MessageHandler.registerDefaultMessageHandler(require('./messageTypes/Default'));
MessageHandler.registerMessageHandler('tip', require('./messageTypes/Tip'));
MessageHandler.registerMessageHandler('card', require('./messageTypes/Card'));
MessageHandler.registerMessageHandler('file', require('./messageTypes/File'));
require('./messageTypes/MsgItem.scss');

require('./MsgContainer.scss');
class MsgContainer extends React.Component {
  constructor(props) {
    super(props);
    this.isSeekingLog = false;
    this.state = {
      nomore: false,
    }
  }

  componentDidMount() {
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

    if(
      this.props.msgList.first() &&
      nextProps.msgList.first() &&
      nextProps.msgList.first().get('date') !== this.props.msgList.first().get('date')
    ) {
      // 加载更多
      let bottomDis = this.refs.container.scrollHeight - this.refs.container.scrollTop;
      setTimeout(() => {
        this.refs.container.scrollTop = this.refs.container.scrollHeight - bottomDis;
      }, 0);
    }
  }

  componentDidUpdate() {
    if(this.isSeekingLog === true) {
      return;
    }

    // 进度条滚动到底部
    setTimeout(() => {
      scrollTo.bottom(this.refs.container, 100);
    }, 0);
  }

  _handleGetMoreLog() {
    let date = this.props.msgList.first().get('date');
    let { converseUUID } = this.props;
    this.props.dispatch(getMoreChatLog(converseUUID, date, !this.props.isGroup));
    this.isSeekingLog = true;
  }

  _handleContainerLoad(el) {
    if(this.isSeekingLog === true) {
      return;
    }

    if(el && el.nodeName.toLowerCase() === 'img' && el.getAttribute('role') === 'chatimage') {
      // 仅当加载完毕的元素为聊天图片时
      // 进度条滚动到底部
      setTimeout(() => {
        scrollTo.bottom(this.refs.container, 100);
      }, 0);
    }
  }

  _handleContainerScroll(el) {
    if(el.scrollHeight - el.scrollTop <= el.offsetHeight) {
      console.log('滚动容器接触到底部!');
      this.isSeekingLog = false;
    }
  }

  render() {
    let { userUUID, usercache } = this.props;

    return (
      <div
        className={'msg-container ' + this.props.className}
        ref="container"
        onLoad={(e) => this._handleContainerLoad(e.target)}
        onScroll={(e) => this._handleContainerScroll(e.target)}
      >
        {
          this.state.nomore || this.props.msgList.size < 10 ? (
            <button className="get-more-log-btn" disabled={true} style={{display: this.props.msgList.size < 10 ? 'none':'block'}}>没有更多记录了</button>
          ) : (
            <button className="get-more-log-btn" onClick={() => this._handleGetMoreLog()}>点击获取更多记录</button>
          )
        }
        <div className="msg-items">
          {
            this.props.msgList.map((item, index, arr) => {
              const prevDate = index > 0 ? arr.getIn([index - 1, 'date']) : 0;
              let isMe = userUUID===item.get('sender_uuid');
              let avatar = isMe ? this.props.selfInfo.get('avatar') : usercache.getIn([item.get('sender_uuid'), 'avatar'])
              let name = isMe
                ? this.props.selfInfo.get('nickname') || this.props.selfInfo.get('username')
                : usercache.getIn([item.get('sender_uuid'), 'nickname']) || usercache.getIn([item.get('sender_uuid'), 'username']);
              let defaultAvatar = item.get('sender_uuid') === 'trpgsystem' ? config.defaultImg.trpgsystem : config.defaultImg.getUser(name);
              let date = item.get('date');

              let diffTime = dateHelper.getDateDiff(prevDate, date);
              let emphasizeTime = diffTime / 1000 / 60 >= 10 // 超过10分钟

              return (
                <MessageHandler
                  key={item.get('uuid')}
                  type={item.get('type')}
                  me={isMe}
                  name={name}
                  avatar={avatar || defaultAvatar}
                  emphasizeTime={emphasizeTime}
                  info={item.toJS()}
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
