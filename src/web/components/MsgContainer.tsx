import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { List, Map } from 'immutable';
import config from '../../shared/project.config';
import { shouleEmphasizeTime } from '../../shared/utils/date-helper';
import scrollTo from '../../shared/utils/animated-scroll-to';
import { getUserInfoCache } from '../../shared/utils/cache-helper';
import { getMoreChatLog } from '../../shared/redux/actions/chat';

import MessageHandler from './messageTypes/__all__';

import './MsgContainer.scss';

interface Props extends DispatchProp<any> {
  msgList: List<any>;
  nomore: boolean;
  converseUUID: string;
  userUUID: string;
  className?: string;
  isGroup: boolean;
  selfInfo: Map<string, any>;
}
class MsgContainer extends React.Component<Props> {
  isSeekingLog = false;
  containerRef: HTMLDivElement;

  componentDidMount() {
    if (this.props.msgList.size === 0) {
      this.setState({ nomore: true });
    } else {
      this.setState({ nomore: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.msgList.first() &&
      nextProps.msgList.first() &&
      nextProps.msgList.first().get('date') !==
        this.props.msgList.first().get('date')
    ) {
      // 加载更多
      if (this.containerRef) {
        let bottomDis =
          this.containerRef.scrollHeight - this.containerRef.scrollTop;
        setTimeout(() => {
          this.containerRef.scrollTop =
            this.containerRef.scrollHeight - bottomDis;
        }, 0);
      }
    }
  }

  componentDidUpdate() {
    if (this.isSeekingLog === true) {
      return;
    }

    // 进度条滚动到底部
    setTimeout(() => {
      scrollTo.bottom(this.containerRef, 100);
    }, 0);
  }

  /**
   * 处理加载更多时间
   */
  handleGetMoreLog() {
    const date = this.props.msgList.first().get('date');
    const { converseUUID } = this.props;
    this.props.dispatch(
      getMoreChatLog(converseUUID, date, !this.props.isGroup)
    );
    this.isSeekingLog = true;
  }

  handleContainerLoad(el) {
    if (this.isSeekingLog === true) {
      return;
    }

    if (
      el &&
      el.nodeName.toLowerCase() === 'img' &&
      el.getAttribute('role') === 'chatimage'
    ) {
      // 仅当加载完毕的元素为聊天图片时
      // 进度条滚动到底部
      setTimeout(() => {
        scrollTo.bottom(this.containerRef, 100);
      }, 0);
    }
  }

  handleContainerScroll(el) {
    if (el.scrollHeight - el.scrollTop <= el.offsetHeight) {
      console.log('滚动容器接触到底部!');
      this.isSeekingLog = false;
    }
  }

  render() {
    let { userUUID } = this.props;

    return (
      <div
        className={'msg-container ' + this.props.className}
        ref={(ref) => (this.containerRef = ref)}
        onLoad={(e) => this.handleContainerLoad(e.target)}
        onScroll={(e) => this.handleContainerScroll(e.target)}
      >
        {this.props.nomore || this.props.msgList.size < 10 ? (
          <button
            className="get-more-log-btn"
            disabled={true}
            style={{ display: this.props.msgList.size < 10 ? 'none' : 'block' }}
          >
            没有更多记录了
          </button>
        ) : (
          <button
            className="get-more-log-btn"
            onClick={() => this.handleGetMoreLog()}
          >
            点击获取更多记录
          </button>
        )}
        <div className="msg-items">
          {this.props.msgList.map((item, index, arr) => {
            const prevDate = index > 0 ? arr.getIn([index - 1, 'date']) : 0;
            const senderUUID = item.get('sender_uuid');
            const isMe = userUUID === senderUUID;
            const senderInfo = isMe
              ? this.props.selfInfo
              : getUserInfoCache(senderUUID);
            const name =
              senderInfo.get('nickname') || senderInfo.get('username');
            const avatar = senderInfo.get('avatar');
            const defaultAvatar =
              item.get('sender_uuid') === 'trpgsystem'
                ? config.defaultImg.trpgsystem
                : config.defaultImg.getUser(name);
            const date = item.get('date');

            const emphasizeTime = shouleEmphasizeTime(prevDate, date);

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
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect((state: any, ownProps: any) => {
  let converseUUID = ownProps.converseUUID;
  let msgList = state.getIn(['chat', 'converses', converseUUID, 'msgList']);

  return {
    msgList: msgList && msgList.sortBy((item) => item.get('date')),
    nomore: state.getIn(['chat', 'converses', converseUUID, 'nomore'], false),
    userUUID: state.getIn(['user', 'info', 'uuid']),
    selfInfo: state.getIn(['user', 'info']),
    friendRequests: state.getIn(['user', 'friendRequests']),
    friendList: state.getIn(['user', 'friendList']),
    groupInvites: state.getIn(['group', 'invites']),
    groupUUIDList: state
      .getIn(['group', 'groups'])
      .map((item) => item.get('uuid')),
  };
})(MsgContainer);
