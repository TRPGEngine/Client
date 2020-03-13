import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import _values from 'lodash/values';
import { useMemo } from 'react';
import { ChatStateConverse } from '@redux/types/chat';

type ConverseType = 'user' | 'group';

/**
 * 返回会话列表
 * @param filterType 会话类型
 */
export function useConverses(filterType: ConverseType[]): ChatStateConverse[] {
  const converses = useTRPGSelector((state) => state.chat.converses);

  return useMemo(() => {
    return _values(converses).filter((converse) =>
      filterType.includes(converse.type as ConverseType)
    );
  }, [converses, filterType]);
}
