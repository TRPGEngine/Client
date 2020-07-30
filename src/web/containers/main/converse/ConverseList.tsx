import React, { useMemo, useCallback } from 'react';
import dateHelper from '@shared/utils/date-helper';
import config from '@shared/project.config';
import ConverseDetail from './ConverseDetail';
import { TabsController, Tab } from '@web/components/Tabs';
import ConvItem from '@web/components/ConvItem';
import { switchConverse, removeUserConverse } from '@shared/redux/actions/chat';
import { showProfileCard } from '@shared/redux/actions/ui';
import _get from 'lodash/get';
import _isArray from 'lodash/isArray';
import _values from 'lodash/values';
import _filter from 'lodash/filter';
import _sortBy from 'lodash/sortBy';
import _size from 'lodash/size';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGDispatch,
  useTRPGSelector,
} from '@shared/hooks/useTRPGSelector';

import './ConverseList.scss';

const ConverseList: React.FC = TMemo(() => {
  const dispatch = useTRPGDispatch();

  const welcomeMessage = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 6) {
      return '我欲修仙，法力无边。';
    } else if (hours < 12) {
      return '早上好，今天请继续加油！';
    } else if (hours < 18) {
      return '下午好，喝杯茶吧，让精神抖擞起来。';
    } else {
      return '跑团时间到！赶紧找个团一起哈啤！';
    }
  }, []);

  const handleSelectConverse = useCallback(
    (converseUUID: string) => {
      console.log('选择会话', converseUUID);
      dispatch(switchConverse(converseUUID));
    },
    [dispatch]
  );

  const converses = useTRPGSelector((state) => state.chat.converses);
  const conversesDesc = useTRPGSelector((state) => state.chat.conversesDesc);
  const usercache = useTRPGSelector((state) => state.cache.user);
  const selectedUUID = useTRPGSelector(
    (state) => state.chat.selectedConverseUUID
  );
  const userInfo = useTRPGSelector((state) => state.user.info);
  const userWritingList = useTRPGSelector(
    (state) => _get(state, ['chat', 'writingList', 'user']) ?? []
  );
  const converseList = useMemo(() => {
    if (_size(converses) > 0) {
      const conversesNode = _sortBy(
        _values(converses).filter(
          (item) => item.type === 'user' || item.type === 'system'
        ),
        (item) => new Date(item.lastTime || 0)
      )
        .reverse()
        .map((item, index) => {
          const uuid = item.uuid;
          const defaultIcon =
            uuid === 'trpgsystem'
              ? config.defaultImg.trpgsystem
              : config.defaultImg.getUser(item.name);
          const userUUID = uuid;
          let icon = item.icon || _get(usercache, [uuid, 'avatar']);
          icon = config.file.getAbsolutePath!(icon) || defaultIcon;

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
              isSelected={selectedUUID === uuid}
              hideCloseBtn={false}
              onClick={() => handleSelectConverse(uuid)}
              onClickIcon={() => dispatch(showProfileCard(uuid))}
              onClickCloseBtn={() => dispatch(removeUserConverse(uuid))}
            />
          );
        });

      return <div className="converses-list">{conversesNode}</div>;
    } else {
      return (
        <div className="converses-list">
          <div className="converses-tip">{conversesDesc}</div>
        </div>
      );
    }
  }, [
    dispatch,
    converses,
    usercache,
    selectedUUID,
    conversesDesc,
    userWritingList,
    userInfo,
  ]);

  const friends = useTRPGSelector((state) => state.user.friendList);
  const friendList = useMemo(() => {
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
                onClick={() => dispatch(showProfileCard(uuid))}
                hideCloseBtn={true}
              />
            );
          })
        ) : (
          <div className="no-friend">暂无好友哦</div>
        )}
      </div>
    );
  }, [friends, usercache, dispatch]);

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
            {converseList}
          </Tab>
          <Tab
            name={
              <span>
                <i className="iconfont">&#xe60d;</i>好友
              </span>
            }
          >
            {friendList}
          </Tab>
        </TabsController>
      </div>
      <div className="detail">
        {selectedUUID ? (
          <ConverseDetail />
        ) : (
          <div className="nocontent">
            <p className="nocontent-img">
              <img src="/src/web/assets/img/dice.png" />
            </p>
            <p className="welcome">{welcomeMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
});
ConverseList.displayName = 'ConverseList';

export default ConverseList;
