import React, { useMemo, useCallback, Fragment } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { UserName } from './UserName';
import { joinArray } from '@shared/utils/array-helper';
import styled from 'styled-components';
import _map from 'lodash/map';
import _take from 'lodash/take';
import _isArray from 'lodash/isArray';
import { useSpring, animated } from 'react-spring';
import { useMeasure } from 'react-use';
import { WritingListGroupItem } from '@redux/types/chat';
import { useRNStorage } from '@shared/hooks/useRNStorage';

const MOST_DISPLAY_NUM = 3; //最多在summary中显示的人数

const Container = styled.div`
  position: relative;
`;

const InnerContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  padding: 2px 4px;
  z-index: 1;
  background-color: ${(props) => props.theme.color['tacao']};
  color: white;
`;

const Summary = styled.div<{
  hasDetail: boolean;
}>`
  display: flex;
  cursor: ${(props) => (props.hasDetail ? 'pointer' : 'default')};
`;

const SummaryText = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Detail = styled(animated.div)`
  border-top: ${(props) => props.theme.border.thin};
`;

const DetailRow = styled.div`
  /* 最大3行 */
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
`;

/**
 * 用于显示当前正在输入状态的指示器
 * 放在聊天列表上面
 */
interface Props {
  /**
   * uuid列表或者带当前输入的列表
   */
  list: (string | WritingListGroupItem)[];
}

const ChatWritingIndicatorInner: React.FC<Props> = TMemo((props) => {
  const [showDetail, setShowDetail] = useRNStorage(
    'chat-writing-indicator-show',
    false
  );

  const list = useMemo(() => {
    return props.list.map((item) => {
      if (typeof item === 'string') {
        return {
          uuid: item,
        };
      } else {
        return item;
      }
    });
  }, [props.list]);

  const hasDetail = useMemo(() => {
    return _map(list, 'text').filter(Boolean).length > 0;
  }, [list]);

  const summaryText = useMemo(() => {
    const names = joinArray(
      _take(list, MOST_DISPLAY_NUM).map((item) => (
        <UserName key={item.uuid} uuid={item.uuid} />
      )),
      ', '
    );

    if (list.length > MOST_DISPLAY_NUM) {
      return (
        <Fragment>
          {names} <span>等{list.length}人正在输入...</span>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          {names} <span>正在输入...</span>
        </Fragment>
      );
    }
  }, [list]);

  const detailText = useMemo(() => {
    return list.map(
      (item, i) =>
        'text' in item && (
          <DetailRow key={i}>
            <UserName uuid={item.uuid} />
            <span>: {item.text}</span>
          </DetailRow>
        )
    );
  }, [list]);

  const [ref, { height: detailHeight }] = useMeasure();
  const detailStyle = useSpring({
    from: {
      height: 0,
      opacity: 0,
    },
    to: {
      height: showDetail ? detailHeight : 0,
      opacity: showDetail ? 1 : 0,
    },
  });

  const handleClick = useCallback(() => {
    if (hasDetail) {
      setShowDetail(!showDetail);
    }
  }, [hasDetail, showDetail, setShowDetail]);

  return (
    <InnerContainer>
      <Summary hasDetail={hasDetail} onClick={handleClick}>
        <SummaryText>{summaryText}</SummaryText>
        {hasDetail && <i className="iconfont">&#xe625;</i>}
      </Summary>
      <Detail style={detailStyle}>
        <div ref={ref}>{detailText}</div>
      </Detail>
    </InnerContainer>
  );
});
ChatWritingIndicatorInner.displayName = 'ChatWritingIndicatorInner';

export const ChatWritingIndicator: React.FC<Props> = TMemo((props) => {
  return (
    <Container>
      {_isArray(props.list) && props.list.length > 0 && (
        <ChatWritingIndicatorInner list={props.list} />
      )}
    </Container>
  );
});
ChatWritingIndicator.displayName = 'ChatWritingIndicator';
