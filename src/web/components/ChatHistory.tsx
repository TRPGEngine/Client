import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useChatHistory } from '@redux/hooks/useChatHistory';
import { Input, Pagination } from 'antd';
import LoadingSpinner from './LoadingSpinner';
import styled from 'styled-components';
import { MessageItem } from '@shared/components/message/MessageItem';
import { MessageItemConfigContextProvider } from '@shared/components/message/MessageItemConfigContext';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { shouleEmphasizeTime } from '@shared/utils/date-helper';
import { useTranslation } from '@shared/i18n';

const Container = styled.div`
  padding: 10px;

  .content > .body {
    /* 在消息历史中取消两边外边距 */
    margin: 0 !important;
  }
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
  const {
    loading,
    error,
    logs,
    page,
    changePage,
    count,
    setSearchKeyword,
  } = useChatHistory(groupUUID, converseUUID, SIZE);
  const { t } = useTranslation();

  const paginationEl = useMemo(() => {
    return (
      <Pagination
        style={{ textAlign: 'center' }}
        simple={true}
        current={page}
        total={count}
        onChange={changePage}
        pageSize={SIZE}
        hideOnSinglePage={true}
        showSizeChanger={false}
      />
    );
  }, [page, count, changePage]);

  const searchEl = (
    <div>
      <Input.Search
        placeholder={t('搜索聊天记录')}
        onSearch={(keyword) => setSearchKeyword(keyword)}
      />
    </div>
  );

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
        {searchEl}
        {paginationEl}
        {loading && <LoadingSpinner />}
        {_isNil(error) ? (
          logs.map((log, index, arr) => {
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
          })
        ) : (
          <div>{error}</div>
        )}
        {paginationEl}
      </Container>
    </MessageItemConfigContextProvider>
  );
});
ChatHistory.displayName = 'ChatHistory';
