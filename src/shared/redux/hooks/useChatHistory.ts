import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAsync } from 'react-use';
import _isNil from 'lodash/isNil';
import type { MsgPayload } from '@redux/types/chat';
import { request, CommonRequestResult } from '@shared/utils/request';

interface ChatLogListData {
  logs: MsgPayload[];
  count: number;
}

/**
 * 聊天历史记录
 * 显示是从最后一页往前数
 * 查询是从第一页往后数。倒序
 */
export function useChatHistory(
  groupUUID: string,
  converseUUID: string,
  size: number
) {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');

  const { loading, value, error } = useAsync(async (): Promise<
    CommonRequestResult<ChatLogListData>
  > => {
    if (typeof searchKeyword === 'string' && searchKeyword.length > 0) {
      // 搜索
      const { data } = await request.get(
        `/chat/log/converse/${converseUUID}/search`,
        {
          params: {
            keyword: searchKeyword,
            page,
            size,
          },
        }
      );

      if (data.result === true) {
        return {
          result: true,
          logs: data.logs,
          count: Math.max(data.logs.length, size), // 不允许翻页
        };
      } else {
        return {
          result: false,
          msg: data.msg,
        };
      }
    } else {
      const { data } = await request.get<CommonRequestResult<ChatLogListData>>(
        `/group/chatlog/${groupUUID}/${converseUUID}`,
        {
          params: {
            page,
            size,
          },
        }
      );

      return data;
    }
  }, [groupUUID, converseUUID, page, size, searchKeyword]);

  useEffect(() => {
    if (_isNil(value?.count)) {
      return;
    }

    setCount(value!.count);
  }, [value?.count]);

  const totalPage = useMemo(() => Math.ceil(count / size), [count, size]);

  const changePage = useCallback(
    (p: number) => {
      setPage(Math.max(totalPage - (p - 1), 0));
    },
    [totalPage]
  );

  if (!_isNil(error)) {
    return {
      loading,
      error,
      logs: [],
      count: 0,
      page: 0,
      changePage,
      setSearchKeyword,
    };
  } else if (value?.result === false) {
    return {
      loading,
      error: value.msg,
      logs: [],
      count: 0,
      page: 0,
      changePage,
      setSearchKeyword,
    };
  } else {
    return {
      loading,
      error: null,
      logs: value?.logs ?? [],
      count,
      page: totalPage - (page - 1),
      changePage,
      setSearchKeyword,
    };
  }
}
