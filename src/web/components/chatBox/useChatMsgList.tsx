import React, {
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import { shouleEmphasizeTime } from '@shared/utils/date-helper';
import _head from 'lodash/head';
import _get from 'lodash/get';
import _last from 'lodash/last';
import _throttle from 'lodash/throttle';
import _isNil from 'lodash/isNil';
import { MessageItem } from '@shared/components/message/MessageItem';
import {
  useTRPGDispatch,
  useTRPGSelector,
} from '@shared/hooks/useTRPGSelector';
import { getMoreChatLog } from '@redux/actions/chat';
import { useMsgList, useConverseDetail } from '@redux/hooks/chat';
import { scrollToBottom } from '@shared/utils/animated-scroll-to';
import { useCurrentUserInfo } from '@redux/hooks/user';
import styled from 'styled-components';
import { usePrevious } from 'react-use';
import type { MsgPayload } from '@redux/types/chat';
import { useTranslation } from '@shared/i18n';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';

const LoadmoreText = styled.div<{
  disable?: boolean;
}>`
  display: block;
  text-align: center;
  width: 100%;
  padding: 0;
  margin: 10px 0;
  font-size: 12px;
  color: ${(props) =>
    props.disable === true
      ? props.theme.color['dusty-gray']
      : props.theme.color['tacao']};
  cursor: ${(props) => (props.disable === true ? 'default' : 'pointer')};
`;

// 触及底部判定的距离
const TRIGGER_DISTANCE = 60;

/**
 * 加载更多相关hook
 */
function useChatMsgListLoadMore(
  containerRef: React.RefObject<HTMLDivElement>,
  converseUUID: string,
  msgList: MsgPayload[],
  nomore: boolean
) {
  const converseDetail = useConverseDetail(converseUUID);
  const dispatch = useTRPGDispatch();
  const isGroup = ['channel', 'group'].includes(converseDetail?.type ?? ''); // 是否为团里面的会话
  const prevBottomDistanceRef = useRef(0);
  const isSeekingLogRef = useRef(false);
  const { t } = useTranslation();
  const handleGetMoreLog = () => {
    if (!containerRef.current) {
      return;
    }

    prevBottomDistanceRef.current =
      containerRef.current.scrollHeight - containerRef.current.scrollTop; // 记录位置
    const date = _head(msgList)!.date;
    isSeekingLogRef.current = true;
    dispatch(getMoreChatLog(converseUUID, date, !isGroup));
  };
  const prevMsgList = usePrevious(msgList);
  useLayoutEffect(() => {
    if (
      _head(prevMsgList) &&
      _head(msgList) &&
      _head(msgList)!.date !== _head(prevMsgList)!.date
    ) {
      // 加载更多
      if (containerRef.current) {
        containerRef.current.scrollTop =
          containerRef.current.scrollHeight - prevBottomDistanceRef.current;
      }
    }
  }, [msgList, prevMsgList, containerRef, prevBottomDistanceRef]);
  const loadMoreEl =
    nomore || msgList.length < 10 ? (
      <LoadmoreText
        disable={true}
        style={{ display: msgList.length < 10 ? 'none' : 'block' }}
      >
        {t('没有更多记录了')}
      </LoadmoreText>
    ) : (
      <LoadmoreText onClick={handleGetMoreLog}>
        {t('点击获取更多记录')}
      </LoadmoreText>
    );

  return { isSeekingLogRef, loadMoreEl };
}

export function useChatMsgList(converseUUID: string) {
  const selfInfo = useCurrentUserInfo();
  const containerRef = useRef<HTMLDivElement>(null);
  const userUUID = selfInfo.uuid;
  const { list: msgList, nomore } = useMsgList(converseUUID);
  const msgStyleCombine = useTRPGSelector(
    (state) => state.settings.user.msgStyleCombine ?? false
  );
  const [showScrollToBottomBtn, setShowScrollToBottomBtn] = useState(false);
  const { setScrollToBottom } = useMsgContainerContext();

  // 消息列表
  const msgListEl = useMemo(() => {
    return msgList.map((item, index, arr) => {
      const prevMsg = arr[index - 1] ?? null;
      const prevDate = index > 0 ? prevMsg.date : 0;
      const prevSenderUUID = prevMsg?.sender_uuid;
      const date = item.date;
      const emphasizeTime = shouleEmphasizeTime(prevDate, date);

      // 是否隐藏发送者信息
      // 强调时间的信息永远不忽略发送者信息
      const omitSenderInfo =
        msgStyleCombine === true &&
        emphasizeTime === false &&
        item.sender_uuid === prevSenderUUID;

      return (
        <MessageItem
          key={item.uuid}
          data={item}
          emphasizeTime={emphasizeTime}
          omitSenderInfo={omitSenderInfo}
        />
      );
    });
  }, [msgList, selfInfo, userUUID, msgStyleCombine]);

  // 加载更多
  const { isSeekingLogRef, loadMoreEl } = useChatMsgListLoadMore(
    containerRef,
    converseUUID,
    msgList,
    nomore
  );

  /**
   * 滚动到底部
   */
  const handleScrollToBottom = useMemo(
    () =>
      _throttle(
        () => {
          if (containerRef.current) {
            scrollToBottom(containerRef.current, 100);
          }
          setShowScrollToBottomBtn(false);
        },
        100,
        {
          leading: true,
          trailing: true,
        }
      ),
    []
  );
  useEffect(() => {
    setScrollToBottom(() => handleScrollToBottom);
  }, [setScrollToBottom, handleScrollToBottom]);

  useEffect(() => {
    if (isSeekingLogRef.current === true) {
      // 如果正在浏览历史则不滚动到底部
      return;
    }

    // 元素更新时滚动到底部
    handleScrollToBottom();
  }, [_last(msgList)]);

  const handleWheel = useCallback((e: React.SyntheticEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distance = el.scrollHeight - el.scrollTop - el.offsetHeight; // 滚动条距离底部的距离
    if (distance <= TRIGGER_DISTANCE) {
      // 滚动容器接触到底部
      isSeekingLogRef.current = false;
      setShowScrollToBottomBtn(false);
    } else {
      // 翻阅聊天记录
      isSeekingLogRef.current = true;
      setShowScrollToBottomBtn(true);
    }
  }, []);

  const handleListLoad = useCallback(() => {
    if (isSeekingLogRef.current === false) {
      // 如果没有手动翻阅 则滚动到底部
      handleScrollToBottom();
    }
  }, [handleScrollToBottom]);

  return {
    containerRef,
    msgListEl,
    loadMoreEl,
    handleWheel,
    handleListLoad,
    showScrollToBottomBtn,
    handleScrollToBottom,
  };
}
