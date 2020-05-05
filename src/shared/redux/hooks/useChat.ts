import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { WritingListGroupItem } from '@redux/types/chat';

/**
 * 获取团当前输入状态列表
 * @param groupUUID 团UUID
 */
export function useGroupWritingState(
  groupUUID: string
): WritingListGroupItem[] {
  return useTRPGSelector(
    (state) => state.chat.writingList.group[groupUUID] ?? []
  );
}
