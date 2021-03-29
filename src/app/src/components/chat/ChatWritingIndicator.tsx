import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import { TMemo } from '@shared/components/TMemo';
import { UserName } from '../UserName';
import { joinArray } from '@shared/utils/array-helper';
import styled from 'styled-components/native';
import _map from 'lodash/map';
import _take from 'lodash/take';
import _isArray from 'lodash/isArray';
import { useSpring, animated } from 'react-spring/native';
import { WritingListGroupItem } from '@redux/types/chat';
import { useStorage } from '@shared/hooks/useStorage';
import { TIcon } from '../TComponent';

const MOST_DISPLAY_NUM = 3; // 最多在summary中显示的人数

const Container = styled.View`
  position: relative;
`;

const InnerContainer = styled.View`
  position: absolute;
  top: 0;
  width: 100%;
  padding: 2px 4px;
  z-index: 1;
  background-color: ${(props) => props.theme.color['tacao']};
`;

const Summary = styled.TouchableOpacity<{
  hasDetail: boolean;
}>`
  display: flex;
  flex-direction: row;
  padding: 6px 0;
`;

const SummaryText = styled.Text`
  flex: 1;
  overflow: hidden;
  color: white;
`;

const Detail = styled.View`
  border: ${(props) => props.theme.border.thin};
  border-bottom-width: 0;
  border-left-width: 0;
  border-right-width: 0;
`;

const DetailRow = styled.Text.attrs({
  /* 最大3行 */
  numberOfLines: 3,
})`
  overflow: hidden;
  color: white;
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
  const [showDetail, setShowDetail] = useStorage(
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
      <Text>, </Text>
    );

    if (list.length > MOST_DISPLAY_NUM) {
      return (
        <Text>
          {names} <Text>等{list.length}人正在输入...</Text>
        </Text>
      );
    } else {
      return (
        <Text>
          {names} <Text>正在输入...</Text>
        </Text>
      );
    }
  }, [list]);

  const detailText = useMemo(() => {
    return list.map(
      (item, i) =>
        'text' in item && (
          <DetailRow key={i}>
            <UserName uuid={item.uuid} />
            <Text>: {item.text}</Text>
          </DetailRow>
        )
    );
  }, [list]);

  const [detailTextHeight, setDetailTextHeight] = useState(0);
  const handleDetailTextLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setDetailTextHeight(e.nativeEvent.layout.height);
    },
    [setDetailTextHeight]
  );

  // 不要动画了. RN端动画不太会写
  // const detailStyle = useSpring({
  //   from: {
  //     height: 0,
  //     opacity: 0,
  //   },
  //   to: {
  //     height: showDetail ? detailTextHeight : 0,
  //     opacity: showDetail ? 1 : 0,
  //   },
  // });
  const detailStyle = useMemo(() => {
    return {
      height: showDetail ? detailTextHeight : 0,
      opacity: showDetail ? 1 : 0,
    };
  }, [showDetail, detailTextHeight]);

  const handleClick = useCallback(() => {
    if (hasDetail) {
      setShowDetail(!showDetail);
    }
  }, [hasDetail, showDetail, setShowDetail]);

  return (
    <InnerContainer>
      <Summary hasDetail={hasDetail} onPress={handleClick}>
        <SummaryText>{summaryText}</SummaryText>
        {hasDetail && <TIcon style={{ color: 'white' }} icon="&#xe625;" />}
      </Summary>
      <Detail style={detailStyle}>
        <Text onLayout={handleDetailTextLayout}>{detailText}</Text>
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
