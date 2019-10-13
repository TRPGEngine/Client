import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import dateHelper from '@shared/utils/date-helper';
import config from '@shared/project.config';
import ConverseDetail from './ConverseDetail';
// import Tab from '../../../components/Tab';
import { TabsController, Tab } from '../../../components/Tabs';
import ConvItem from '../../../components/ConvItem';
import { switchConverse, removeUserConverse } from '@shared/redux/actions/chat';
import { showProfileCard } from '@shared/redux/actions/ui';

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
      let usercache = this.props.usercache;
      let converses = this.props.converses
        .valueSeq()
        .filter(
          (item) => item.get('type') === 'user' || item.get('type') === 'system'
        )
        .sortBy((item) => new Date(item.get('lastTime') || 0))
        .reverse()
        .map((item, index) => {
          let uuid = item.get('uuid');
          let defaultIcon =
            uuid === 'trpgsystem'
              ? config.defaultImg.trpgsystem
              : config.defaultImg.getUser(item.get('name'));
          let attachIcon =
            item.get('type') === 'user'
              ? this.props.usercache.getIn([item.get('members', 0), 'avatar'])
              : null;
          let userUUID = item.get('members')
            ? item
                .get('members')
                .find((i) => i !== this.props.userInfo.get('uuid'))
            : uuid;
          let icon =
            item.get('icon') || usercache.getIn([uuid, 'avatar']) || attachIcon;
          icon = config.file.getAbsolutePath(icon) || defaultIcon;

          return (
            <ConvItem
              key={'converses#' + index}
              icon={icon}
              title={item.get('name')}
              content={item.get('lastMsg')}
              time={
                item.get('lastTime')
                  ? dateHelper.getShortDiff(item.get('lastTime'))
                  : ''
              }
              uuid={uuid}
              unread={item.get('unread')}
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
    let friends = this.props.friends.toJS();
    let usercache = this.props.usercache;

    return (
      <div className="friend-list">
        {friends.length > 0 ? (
          friends.map((item, index) => {
            let uuid = item;
            let name =
              usercache.getIn([uuid, 'nickname']) ||
              usercache.getIn([uuid, 'username']);
            return (
              <ConvItem
                key={`friends#${uuid}#${index}`}
                icon={
                  usercache.getIn([uuid, 'avatar']) ||
                  config.defaultImg.getUser(name)
                }
                title={name}
                content={usercache.getIn([uuid, 'sign'])}
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

export default connect((state: any) => ({
  selectedUUID: state.getIn(['chat', 'selectedConversesUUID']),
  conversesDesc: state.getIn(['chat', 'conversesDesc']),
  converses: state.getIn(['chat', 'converses']),
  friends: state.getIn(['user', 'friendList']),
  usercache: state.getIn(['cache', 'user']),
  userInfo: state.getIn(['user', 'info']),
  userWritingList: state.getIn(['chat', 'writingList', 'user'], []),
}))(ConverseList);
