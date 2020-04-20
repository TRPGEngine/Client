import { useWebAuthRequest } from './useWebAuthRequest';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAsync } from 'react-use';
import { ChatLogItem } from '@portal/model/chat';
import _isNil from 'lodash/isNil';

/**
 * 聊天历史记录
 * 显示是从最后一页往前数
 * 查询是从第一页往后数。倒序
 */
export function useChatHistory(converseUUID: string, size: number) {
  const request = useWebAuthRequest();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const { loading, value } = useAsync(() => {
    return request<{
      logs: ChatLogItem[];
      count: number;
    }>(`/group/log/${converseUUID}`, 'get', {
      page,
      size,
    }).then((d) => d.data);
  }, [page, size]);

  useEffect(() => {
    if (_isNil(value?.count)) {
      return;
    }

    setCount(value.count);
  }, [value?.count]);

  const totalPage = useMemo(() => Math.ceil(count / size), [count, size]);

  const changePage = useCallback(
    (p: number) => {
      setPage(Math.max(totalPage - (p - 1), 0));
    },
    [totalPage]
  );

  return {
    loading,
    error: value?.result ? value.msg : null,
    logs: value?.logs ?? [],
    count,
    page: totalPage - (page - 1),
    changePage,
  };
}
