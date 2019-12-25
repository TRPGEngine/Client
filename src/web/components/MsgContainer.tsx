import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import config from '@shared/project.config';
import { shouleEmphasizeTime } from '@shared/utils/date-helper';
import scrollTo from '@shared/utils/animated-scroll-to';
import { getUserInfoCache } from '@shared/utils/cache-helper';
import { getMoreChatLog } from '@shared/redux/actions/chat';
import { TRPGState } from '@redux/types/__all__';
import _get from 'lodash/get';
import _head from 'lodash/head';

import MessageHandler from './messageTypes/__all__';

import './MsgContainer.scss';
import { UserInfo } from '@redux/types/user';

interface Props extends DispatchProp<any> {
  msgList: any[];
  nomore: boolean;
  converseUUID: string;
  userUUID: string;
  className?: string;
  isGroup: boolean;
  selfInfo: Partial<UserInfo>;
}
class MsgContainer extends React.Component<Props> {
  isSeekingLog = false;
  containerRef: HTMLDivElement;

  componentDidMount() {
    if (this.props.msgList.length === 0) {
      this.setState({ nomore: true });
    } else {
      this.setState({ nomore: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      _head(this.props.msgList) &&
      _head(nextProps.msgList) &&
      _head<any>(nextProps.msgList).date !== _head(this.props.msgList).date
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
    const date = _head(this.props.msgList).date;
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
    const { className, userUUID, msgList, nomore } = this.props;

    return (
      <div
        className={'msg-container ' + className}
        ref={(ref) => (this.containerRef = ref)}
        onLoad={(e) => this.handleContainerLoad(e.target)}
        onScroll={(e) => this.handleContainerScroll(e.target)}
      >
        {nomore || msgList.length < 10 ? (
          <button
            className="get-more-log-btn"
            disabled={true}
            style={{ display: msgList.length < 10 ? 'none' : 'block' }}
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
          {msgList.map((item, index) => {
            const arr = msgList;
            const prevDate = index > 0 ? _get(arr, [index - 1, 'date']) : 0;
            const senderUUID = item.get('sender_uuid');
            const isMe = userUUID === senderUUID;
            const senderInfo = isMe
              ? this.props.selfInfo
              : getUserInfoCache(senderUUID);
            const name = senderInfo.nickname || senderInfo.username;
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

export default connect((state: TRPGState, ownProps: any) => {
  const converseUUID = ownProps.converseUUID;
  const msgList = _get(state, ['chat', 'converses', converseUUID, 'msgList']);

  return {
    msgList: msgList && msgList.sortBy((item) => item.get('date')),
    nomore: _get(state, ['chat', 'converses', converseUUID, 'nomore'], false),
    userUUID: _get(state, ['user', 'info', 'uuid']),
    selfInfo: state.user.info,
    friendRequests: state.user.friendRequests,
    friendList: state.user.friendList,
    groupInvites: state.group.invites,
    groupUUIDList: state.group.groups.map((item) => item.uuid),
  };
})(MsgContainer);
