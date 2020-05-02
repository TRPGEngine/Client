import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { useMemo } from 'react';
import _isNil from 'lodash/isNil';
import _orderBy from 'lodash/orderBy';

/**
 * 获取会话中的消息列表
 * @param converseUUID 会话UUID
 */
export function useMsgList(converseUUID: string, order?: 'asc' | 'desc') {
  const converse = useTRPGSelector(
    (state) => state.chat.converses[converseUUID]
  );
  const msgList = useMemo(() => {
    if (_isNil(converse.msgList)) {
      return [];
    }
    return _orderBy(converse.msgList, (item) => new Date(item.date), [order]);
  }, [converse.msgList, order]);
  const nomore = converse.nomore;

  return {
    list: msgList,
    nomore,
  };
}
