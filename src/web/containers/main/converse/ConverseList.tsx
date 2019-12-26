import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import dateHelper from '@shared/utils/date-helper';
import config from '@shared/project.config';
import ConverseDetail from './ConverseDetail';
import { TabsController, Tab } from '@web/components/Tabs';
import ConvItem from '@web/components/ConvItem';
import { switchConverse, removeUserConverse } from '@shared/redux/actions/chat';
import { showProfileCard } from '@shared/redux/actions/ui';
import _get from 'lodash/get';
import _isArray from 'lodash/isArray';
import { TRPGState } from '@redux/types/__all__';

import './ConverseList.scss';

interface Props extends DispatchProp<any> {
  selectedUUID: string;
  conversesDesc: string;
  converses: any;
  friends: any;
  usercache: any;
  userInfo: any;
  userWritingList: any;
}
class ConverseList extends React.Component<Props> {
  handleSelectConverse(converseUUID) {
    console.log('选择会话', converseUUID);
    this.props.dispatch(switchConverse(converseUUID));
  }

  getWelcomeMessage() {
    let hours = new Date().getHours();
    if (hours < 6) {
      return '我欲修仙，法力无边。';
    } else if (hours < 12) {
      return '早上好，今天请继续加油！';
    } else if (hours < 18) {
      return '下午好，喝杯茶吧，让精神抖擞起来。';
    } else {
      return '跑团时间到！赶紧找个团一起哈啤！';
    }
  }

  getConverseList() {
    if (this.props.converses.size > 0) {
      const userWritingList = this.props.userWritingList;
      const usercache = this.props.usercache;
      const converses = this.props.converses
        .valueSeq()
        .filter((item) => item.type === 'user' || item.type === 'system')
        .sortBy((item) => new Date(item.lastTime || 0))
        .reverse()
        .map((item, index) => {
          const uuid = item.uuid;
          const defaultIcon =
            uuid === 'trpgsystem'
              ? config.defaultImg.trpgsystem
              : config.defaultImg.getUser(item.name);
          const attachIcon =
            item.type === 'user'
              ? _get(this.props.usercache, [item.members ?? 0, 'avatar'])
              : null;
          const userUUID = _isArray(item.members)
            ? item.members.find((i) => i !== this.props.userInfo.uuid)
            : uuid;
          let icon =
            item.icon || _get(usercache, [uuid, 'avatar']) || attachIcon;
          icon = config.file.getAbsolutePath(icon) || defaultIcon;

          return (
            <ConvItem
              key={'converses#' + index}
              icon={icon}
              title={item.name}
              content={item.lastMsg}
              time={item.lastTime ? dateHelper.getShortDiff(item.lastTime) : ''}
              uuid={uuid}
              unread={item.unread}
              isWriting={userWritingList.includes(userUUID)}
              isSelected={this.props.selectedUUID === uuid}
              hideCloseBtn={false}
              onClick={() => this.handleSelectConverse(uuid)}
              onClickIcon={() => this.props.dispatch(showProfileCard(uuid))}
              onClickCloseBtn={() =>
                this.props.dispatch(removeUserConverse(uuid))
              }
            />
          );
        });

      return <div className="converses-list">{converses}</div>;
    } else {
      return (
        <div className="converses-list">
          <div className="converses-tip">{this.props.conversesDesc}</div>
        </div>
      );
    }
  }

  getFriendList() {
    const friends = this.props.friends;
    const usercache = this.props.usercache;

    return (
      <div className="friend-list">
        {friends.length > 0 ? (
          friends.map((item, index) => {
            const uuid = item;
            const name =
              _get(usercache, [uuid, 'nickname']) ??
              _get(usercache, [uuid, 'username']);
            return (
              <ConvItem
                key={`friends#${uuid}#${index}`}
                icon={
                  _get(usercache, [uuid, 'avatar']) ??
                  config.defaultImg.getUser(name)
                }
                title={name}
                content={_get(usercache, [uuid, 'sign'])}
                time=""
                uuid=""
                isSelected={false}
                onClick={() => this.props.dispatch(showProfileCard(uuid))}
                hideCloseBtn={true}
              />
            );
          })
        ) : (
          <div className="no-friend">暂无好友哦</div>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="converse">
        <div className="list">
          <TabsController>
            <Tab
              name={
                <span>
                  <i className="iconfont">&#xe769;</i>消息
                </span>
              }
            >
              {this.getConverseList()}
            </Tab>
            <Tab
              name={
                <span>
                  <i className="iconfont">&#xe60d;</i>好友
                </span>
              }
            >
              {this.getFriendList()}
            </Tab>
          </TabsController>
        </div>
        <div className="detail">
          {this.props.selectedUUID ? (
            <ConverseDetail converseUUID={this.props.selectedUUID} />
          ) : (
            <div className="nocontent">
              <p className="nocontent-img">
                <img src="/src/web/assets/img/dice.png" />
              </p>
              <p className="welcome">{this.getWelcomeMessage()}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect((state: TRPGState) => ({
  selectedUUID: state.chat.selectedConverseUUID,
  conversesDesc: state.chat.conversesDesc,
  converses: state.chat.converses,
  friends: state.user.friendList,
  usercache: state.cache.user,
  userInfo: state.user.info,
  userWritingList: _get(state, ['chat', 'writingList', 'user']) ?? [],
}))(ConverseList);
