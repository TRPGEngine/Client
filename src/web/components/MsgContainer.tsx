import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import config from '@shared/project.config';
import { shouleEmphasizeTime } from '@shared/utils/date-helper';
import scrollTo from '@shared/utils/animated-scroll-to';
import { getUserInfoCache } from '@shared/utils/cache-helper';
import { getMoreChatLog } from '@shared/redux/actions/chat';
import _get from 'lodash/get';
import _head from 'lodash/head';
import _isNil from 'lodash/isNil';
import _orderBy from 'lodash/orderBy';
import { MsgListContextProvider } from '@shared/context/MsgListContext';
import { TMemo } from '@shared/components/TMemo';
import {
  useTRPGSelector,
  useTRPGDispatch,
} from '@shared/hooks/useTRPGSelector';
import { usePrevious } from 'react-use';
import { MessageItem } from '@shared/components/message/MessageItem';

import './MsgContainer.scss';

interface Props {
  className?: string;
  converseUUID: string;
  isGroup: boolean;
}
export const MsgContainer: React.FC<Props> = TMemo((props) => {
  const { className, converseUUID, isGroup } = props;
  const converse = useTRPGSelector(
    (state) => state.chat.converses[converseUUID]
  );
  const msgList = useMemo(() => {
    if (_isNil(converse.msgList)) {
      return [];
    }
    return _orderBy(converse.msgList, (item) => new Date(item.date));
  }, [converse.msgList]);
  const nomore = converse.nomore;
  const selfInfo = useTRPGSelector((state) => state.user.info);
  const userUUID = selfInfo.uuid;
  const dispatch = useTRPGDispatch();
  const containerRef = useRef<HTMLDivElement>();
  const isSeekingLogRef = useRef(false);

  const msgListEl = useMemo(() => {
    return msgList.map((item, index) => {
      const arr = msgList;
      const prevDate = index > 0 ? _get(arr, [index - 1, 'date']) : 0;
      const senderUUID = item.sender_uuid;
      const isMe = userUUID === senderUUID;
      const senderInfo = isMe ? selfInfo : getUserInfoCache(senderUUID);
      const name = senderInfo.nickname || senderInfo.username;
      const avatar = senderInfo.avatar;
      const defaultAvatar =
        item.sender_uuid === 'trpgsystem'
          ? config.defaultImg.trpgsystem
          : config.defaultImg.getUser(name);
      const date = item.date;

      const emphasizeTime = shouleEmphasizeTime(prevDate, date);

      return <MessageItem data={item} emphasizeTime={emphasizeTime} />;
    });
  }, [msgList, selfInfo, userUUID]);

  // 处理图片的onLoad
  const handleContainerLoad = useCallback(
    (e: React.SyntheticEvent<HTMLDivElement, Event>) => {
      const el = e.currentTarget;
      if (isSeekingLogRef.current === true) {
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
          scrollTo.bottom(containerRef.current, 100);
        }, 0);
      }
    },
    [isSeekingLogRef, containerRef]
  );

  const handleContainerScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const distance = el.scrollHeight - el.scrollTop - el.offsetHeight; // 滚动条距离底部的距离
      if (distance <= 20) {
        // 滚动容器接触到底部
        isSeekingLogRef.current = false;
      } else {
        // 翻阅聊天记录
        isSeekingLogRef.current = true;
      }
    },
    [isSeekingLogRef]
  );

  // 获取更多聊天记录
  const prevBottomDistanceRef = useRef(0);
  const handleGetMoreLog = useCallback(() => {
    prevBottomDistanceRef.current =
      containerRef.current.scrollHeight - containerRef.current.scrollTop; // 记录位置
    const date = _head(msgList).date;
    dispatch(getMoreChatLog(converseUUID, date, !isGroup));
    isSeekingLogRef.current = true;
  }, [msgList, converseUUID, dispatch, isSeekingLogRef, isGroup, containerRef]);

  useEffect(() => {
    // msgList变化后自动滚动到底部
    if (isSeekingLogRef.current === true) {
      return;
    }

    // 进度条滚动到底部
    setTimeout(() => {
      scrollTo.bottom(containerRef.current, 100);
    }, 0);
  }, [msgList, isSeekingLogRef, containerRef]);

  const prevMsgList = usePrevious(msgList);
  useEffect(() => {
    if (
      _head(prevMsgList) &&
      _head(msgList) &&
      _head(msgList).date !== _head(prevMsgList).date
    ) {
      // 加载更多
      if (containerRef.current) {
        setTimeout(() => {
          containerRef.current.scrollTop =
            containerRef.current.scrollHeight - prevBottomDistanceRef.current;
        }, 0);
      }
    }
  }, [msgList, prevMsgList, containerRef, prevBottomDistanceRef]);

  return useMemo(
    () => (
      <div
        className={'msg-container ' + className}
        ref={containerRef}
        onLoad={handleContainerLoad}
        onScroll={handleContainerScroll}
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
          <button className="get-more-log-btn" onClick={handleGetMoreLog}>
            点击获取更多记录
          </button>
        )}
        <div className="msg-items">
          <MsgListContextProvider msgList={msgList}>
            {msgListEl}
          </MsgListContextProvider>
        </div>
      </div>
    ),
    [
      nomore,
      msgList,
      className,
      containerRef,
      handleContainerLoad,
      handleContainerScroll,
      handleGetMoreLog,
    ]
  );
});
MsgContainer.displayName = 'MsgContainer';
