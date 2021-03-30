import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useChatHistory } from '@shared/hooks/useChatHistory';
import { Pagination } from 'antd';
import LoadingSpinner from './LoadingSpinner';
import styled from 'styled-components';
import { MessageItem } from '@shared/components/message/MessageItem';
import { MessageItemConfigContextProvider } from '@shared/components/message/MessageItemConfigContext';
import _get from 'lodash/get';
import { shouleEmphasizeTime } from '@shared/utils/date-helper';

const Container = styled.div`
  padding: 10px;
`;

interface Props {
  groupUUID: string;
  converseUUID: string;
}

const SIZE = 25;

/**
 * 先实现团聊天记录
 */
export const ChatHistory: React.FC<Props> = TMemo((props) => {
  const { groupUUID, converseUUID } = props;
  const { loading, error, logs, page, changePage, count } = useChatHistory(
    groupUUID,
    converseUUID,
    SIZE
  );

  const paginationEl = useMemo(() => {
    return (
      <Pagination
        style={{ textAlign: 'center' }}
        simple={true}
        current={page}
        total={count}
        onChange={changePage}
        pageSize={SIZE}
      />
    );
  }, [page, count, changePage]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <MessageItemConfigContextProvider
      config={{
        operation: false,
        popover: false,
        showAvatar: false,
        showInlineTime: false,
      }}
    >
      <Container>
        {paginationEl}
        {loading && <LoadingSpinner />}
        {logs.map((log, index, arr) => {
          const prevDate =
            index < arr.length - 1 ? _get(arr, [index - 1, 'date']) : 0;
          const emphasizeTime = shouleEmphasizeTime(prevDate, log.date);

          return (
            <MessageItem
              key={log.uuid}
              emphasizeTime={emphasizeTime}
              data={log}
            />
          );
        })}
        {paginationEl}
      </Container>
    </MessageItemConfigContextProvider>
  );
});
ChatHistory.displayName = 'ChatHistory';
