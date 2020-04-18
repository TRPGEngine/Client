import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useChatHistory } from '@shared/hooks/useChatHistory';
import { Pagination } from 'antd';
import LoadingSpinner from './LoadingSpinner';
import styled from 'styled-components';
import { MessageItem } from '@shared/components/message/MessageItem';

const Container = styled.div`
  padding: 10px;
`;

interface Props {
  converseUUID: string;
}

const SIZE = 25;

/**
 * 先实现团聊天记录
 */
export const ChatHistory: React.FC<Props> = TMemo((props) => {
  const { loading, error, logs, page, changePage, count } = useChatHistory(
    props.converseUUID,
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
    <Container>
      {paginationEl}
      {loading && <LoadingSpinner />}
      {logs.map((log) => {
        return <MessageItem emphasizeTime={false} data={log} />;
      })}
      {paginationEl}
    </Container>
  );
});
ChatHistory.displayName = 'ChatHistory';
