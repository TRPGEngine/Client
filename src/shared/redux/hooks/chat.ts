import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import {
  WritingListGroupItem,
  SimpleConverseType,
  ConverseType,
  ChatStateConverse,
} from '@redux/types/chat';
import { useMemo } from 'react';
import _isNil from 'lodash/isNil';
import _orderBy from 'lodash/orderBy';
import _values from 'lodash/values';

/**
 * 获取当前输入状态
 * @param converseUUID 会话UUID
 * @param type 会话类型
 */
export function useWritingState(converseUUID: string): WritingListGroupItem[] {
  const converse = useConverseDetail(converseUUID);
  const type = converse?.type;

  if (_isNil(converseUUID)) {
    return [];
  }

  return useTRPGSelector((state) => {
    if (type === 'group') {
      return state.chat.writingList.group[converseUUID] ?? [];
    } else if (type === 'channel') {
      return state.chat.writingList.channel[converseUUID] ?? [];
    } else if (type === 'user') {
      // TODO: 先不处理用户会话
      return [];
    } else {
      // 未知类型
      return [];
    }
  });
}

/**
 * 获取会话中的消息列表
 * @param converseUUID 会话UUID
 */
export function useMsgList(
  converseUUID: string,
  order: 'asc' | 'desc' = 'asc'
) {
  const converse = useTRPGSelector(
    (state) => state.chat.converses[converseUUID]
  );
  const msgList = useMemo(() => {
    if (_isNil(converse?.msgList)) {
      return [];
    }
    return _orderBy(converse?.msgList, (item) => new Date(item.date), [order]);
  }, [converse?.msgList, order]);
  const nomore = converse?.nomore ?? false;

  return {
    list: msgList,
    nomore,
  };
}

/**
 * 返回会话列表
 * @param filterType 会话类型
 */
export function useConverses(
  filterType: SimpleConverseType[]
): ChatStateConverse[] {
  const converses = useTRPGSelector((state) => state.chat.converses);

  return useMemo(() => {
    return _values(converses).filter((converse) =>
      filterType.includes(converse.type as SimpleConverseType)
    );
  }, [converses, filterType]);
}

/**
 * 获取会话详情内容
 * @param converseUUID 会话UUID
 */
export function useConverseDetail(
  converseUUID: string
): ChatStateConverse | undefined {
  return useTRPGSelector((state) => state.chat.converses[converseUUID]);
}
